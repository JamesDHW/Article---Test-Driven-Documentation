import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(mobileRoot, '../..');
const maestroDir = path.join(mobileRoot, '.maestro');
const flowsRoot = path.join(maestroDir, 'flows');
const generatedDir = path.join(maestroDir, '.generated');
const buildRoot = path.join(mobileRoot, 'build', 'maestro-results');
const docsScenariosDir = path.join(repoRoot, 'apps', 'docs', 'static', 'scenarios');

function ensureDir(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function removeIfExists(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function discoverFlows(root) {
  if (!fs.existsSync(root)) {
    return [];
  }
  const out = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (/\.ya?ml$/i.test(entry.name)) {
        out.push(fullPath);
      }
    }
  }
  return out.sort();
}

function readEntriesRecursive(rootDir) {
  const out = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!fs.existsSync(current)) {
      continue;
    }
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      out.push(fullPath);
    }
  }
  return out;
}

function timestampSlug() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${datePart}-${timePart}`;
}

function deriveScenarioMeta(flowAbsPath) {
  const relFromFlows = path.relative(flowsRoot, flowAbsPath);
  const withoutExt = relFromFlows.replace(/\.ya?ml$/i, '');
  const slug = `mobile-${withoutExt.split(path.sep).join('-')}`;
  const baseTokens = path.basename(withoutExt).split('-').filter(Boolean);
  const title = baseTokens.length > 0
    ? `${baseTokens[0][0].toUpperCase()}${baseTokens[0].slice(1)}${baseTokens.length > 1 ? ' ' + baseTokens.slice(1).join(' ') : ''}`
    : withoutExt;
  return { slug, title, relPath: relFromFlows };
}

/**
 * Maestro resolves `runFlow.file` at parse time before CLI `-e` parameters are
 * substituted into `${FLOW_FILE}`, so a static wrapper cannot use env vars in
 * `file:`. We emit a tiny harness per run with a concrete relative path.
 */
function writeRecordHarnessYaml({ slug, flowAbsPath }) {
  ensureDir(generatedDir);
  const harnessPath = path.join(generatedDir, `record-${slug}.yaml`);
  const flowFileRel = path.relative(generatedDir, flowAbsPath).split(path.sep).join('/');
  const body = `appId: com.testdrivendocumentationdemo.mobile
---
- startRecording:
    path: ${slug}
    optional: true
- runFlow:
    file: ${flowFileRel}
- stopRecording
`;
  fs.writeFileSync(harnessPath, body, 'utf-8');
  return harnessPath;
}

function recordFlow(flowAbsPath) {
  const { slug, title } = deriveScenarioMeta(flowAbsPath);
  const runOutputDir = path.join(buildRoot, `${timestampSlug()}-${slug}`);
  ensureDir(runOutputDir);

  const harnessPath = writeRecordHarnessYaml({ slug, flowAbsPath });

  const result = spawnSync(
    'maestro',
    [
      'test',
      harnessPath,
      '--test-output-dir',
      runOutputDir,
    ],
    { stdio: 'inherit', cwd: mobileRoot },
  );

  try {
    fs.unlinkSync(harnessPath);
  } catch {
    // ignore
  }

  if (result.status !== 0) {
    throw new Error(`maestro exited with status ${result.status} for flow ${flowAbsPath}`);
  }

  return { slug, title, runOutputDir, flowAbsPath };
}

function extractYamlLabelOrder(flowAbsPath) {
  const text = fs.readFileSync(flowAbsPath, 'utf-8');
  const parts = text.split(/\r?\n---\r?\n/);
  const body = parts.length >= 2 ? parts[1] : text;
  const labels = [];
  const re = /^\s*label:\s*(.+?)\s*$/gm;
  let match;
  while ((match = re.exec(body)) !== null) {
    let value = match[1].trim();
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value.length > 0) {
      labels.push(value);
    }
  }
  return labels;
}

function findLabelInCommand(command) {
  if (!command || typeof command !== 'object') {
    return null;
  }
  for (const key of Object.keys(command)) {
    const inner = command[key];
    if (!inner || typeof inner !== 'object') {
      continue;
    }
    if (typeof inner.label === 'string') {
      const trimmed = inner.label.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return null;
}

function findCommandsJsonPath(runOutputDir) {
  const files = readEntriesRecursive(runOutputDir).filter(
    (filePath) => path.basename(filePath).startsWith('commands-') && filePath.endsWith('.json'),
  );
  if (files.length === 0) {
    return null;
  }
  let bestPath = files[0];
  let bestLen = -1;
  for (const filePath of files) {
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const len = Array.isArray(parsed) ? parsed.length : 0;
      if (len > bestLen) {
        bestLen = len;
        bestPath = filePath;
      }
    } catch {
      // ignore invalid json
    }
  }
  return bestPath;
}

function buildManifestSteps(flowAbsPath, runOutputDir) {
  const yamlOrder = extractYamlLabelOrder(flowAbsPath);
  if (yamlOrder.length === 0) {
    return [];
  }

  const commandsPath = findCommandsJsonPath(runOutputDir);
  if (!commandsPath) {
    return yamlOrder.map((title) => ({ title }));
  }

  let rows;
  try {
    rows = JSON.parse(fs.readFileSync(commandsPath, 'utf-8'));
  } catch {
    return yamlOrder.map((title) => ({ title }));
  }
  if (!Array.isArray(rows)) {
    return yamlOrder.map((title) => ({ title }));
  }

  const firstTimestampByLabel = new Map();
  for (const row of rows) {
    const label = findLabelInCommand(row.command);
    if (!label) {
      continue;
    }
    const t = row.metadata?.timestamp;
    if (typeof t !== 'number') {
      continue;
    }
    if (!firstTimestampByLabel.has(label)) {
      firstTimestampByLabel.set(label, t);
    }
  }

  let runEndMs = 0;
  for (const row of rows) {
    const t = row.metadata?.timestamp;
    const d = row.metadata?.duration;
    if (typeof t !== 'number') {
      continue;
    }
    const dur = typeof d === 'number' ? d : 0;
    runEndMs = Math.max(runEndMs, t + dur);
  }

  const steps = [];
  for (let i = 0; i < yamlOrder.length; i++) {
    const title = yamlOrder[i];
    const start = firstTimestampByLabel.get(title);
    if (start === undefined) {
      steps.push({ title });
      continue;
    }
    let nextStart = runEndMs;
    for (let j = i + 1; j < yamlOrder.length; j++) {
      const candidate = firstTimestampByLabel.get(yamlOrder[j]);
      if (typeof candidate === 'number' && candidate > start) {
        nextStart = candidate;
        break;
      }
    }
    steps.push({ title, durationMs: Math.max(1, nextStart - start) });
  }
  return steps;
}

function collectArtifacts(runOutputDir) {
  const files = readEntriesRecursive(runOutputDir);
  const videos = files
    .filter((filePath) => /\.(mp4|mov|webm)$/i.test(filePath))
    .map((filePath) => ({ filePath, mtimeMs: fs.statSync(filePath).mtimeMs }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
  const screenshots = files
    .filter((filePath) => /\.(png|jpg|jpeg)$/i.test(filePath))
    .sort((a, b) => a.localeCompare(b));
  return {
    videoPath: videos[0]?.filePath ?? null,
    screenshotPaths: screenshots,
  };
}

function publishScenario({ slug, title, runOutputDir, flowAbsPath }) {
  const { videoPath, screenshotPaths } = collectArtifacts(runOutputDir);
  const steps = buildManifestSteps(flowAbsPath, runOutputDir);
  const scenarioDir = path.join(docsScenariosDir, slug);
  const screenshotsDir = path.join(scenarioDir, 'screenshots');

  removeIfExists(scenarioDir);
  ensureDir(scenarioDir);
  ensureDir(screenshotsDir);

  let publishedVideoPath = null;
  if (videoPath) {
    const ext = path.extname(videoPath) || '.mp4';
    const target = path.join(scenarioDir, `video${ext}`);
    fs.copyFileSync(videoPath, target);
    publishedVideoPath = `/scenarios/${slug}/video${ext}`;
  }

  const publishedScreenshots = [];
  for (const screenshotPath of screenshotPaths) {
    const safeName = path.basename(screenshotPath).replace(/\s+/g, '-').toLowerCase();
    const target = path.join(screenshotsDir, safeName);
    fs.copyFileSync(screenshotPath, target);
    publishedScreenshots.push(`/scenarios/${slug}/screenshots/${safeName}`);
  }

  const manifest = {
    title,
    slug,
    source: 'maestro',
    recordedAt: new Date().toISOString(),
    steps,
    artifacts: {
      video: publishedVideoPath,
      trace: null,
      screenshots: publishedScreenshots,
    },
  };

  fs.writeFileSync(path.join(scenarioDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest;
}

function loadIndex() {
  const indexPath = path.join(docsScenariosDir, 'index.json');
  if (!fs.existsSync(indexPath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeIndex(items) {
  ensureDir(docsScenariosDir);
  const indexPath = path.join(docsScenariosDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(items, null, 2));
}

function upsertIndexEntry(manifest) {
  const existing = loadIndex();
  const withoutCurrent = existing.filter((item) => item.slug !== manifest.slug);
  withoutCurrent.push({
    title: manifest.title,
    slug: manifest.slug,
    recordedAt: manifest.recordedAt,
  });
  withoutCurrent.sort((a, b) => a.title.localeCompare(b.title));
  writeIndex(withoutCurrent);
}

function main() {
  const flows = discoverFlows(flowsRoot);
  if (flows.length === 0) {
    console.warn(`No flows found under ${flowsRoot}; nothing to record.`);
    return;
  }

  ensureDir(docsScenariosDir);
  for (const flowAbs of flows) {
    console.log(`Recording ${path.relative(mobileRoot, flowAbs)}...`);
    const recorded = recordFlow(flowAbs);
    const manifest = publishScenario(recorded);
    upsertIndexEntry(manifest);
    console.log(`  -> ${manifest.slug} (video: ${manifest.artifacts.video ?? 'none'}, screenshots: ${manifest.artifacts.screenshots.length})`);
  }
}

main();
