import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '../..');
const reportPath = path.join(process.cwd(), 'playwright-report', 'report.json');

const docsStaticDir = path.join(repoRoot, 'apps', 'docs', 'static', 'scenarios');

const published = [];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Playwright JSON report schema contains suites/specs/tests/results.
// We'll walk it and pick doc tests by title containing '@doc'.
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

function* walkSuites(suite) {
  yield suite;
  if (suite) {
    for (const s of suite.suites || []) yield* walkSuites(s);
  }
}

function extractDocTests() {
  const all = [];
  for (const topLevelSuite of report.suites || []) {
    for (const suite of walkSuites(topLevelSuite)) {
      if (!suite) continue;
      for (const spec of suite.specs || []) {
        for (const t of spec.tests || []) {
          const title = `${spec.title}`;
          if (!title.includes('@doc')) continue;

          // pick the latest result (usually only one)
          const result = (t.results || [])[t.results.length - 1];
          if (!result) continue;

          all.push({ spec, test: t, result });
        }
      }
    }
  }
  return all;
}

function flattenSteps(steps, out = []) {
  for (const s of steps || []) {
    // Include steps that have a title (user-defined steps from test.step)
    // In Playwright JSON report, test.step() creates steps with title and duration, but no category
    if (s.title && (!s.category || s.category === 'test.step')) {
      out.push({ title: s.title, durationMs: s.duration });
    }
    flattenSteps(s.steps, out);
  }
  return out;
}

const docTests = extractDocTests();
if (docTests.length === 0) {
  console.error('No @doc tests found in report.json');
  process.exit(1);
}

ensureDir(docsStaticDir);

for (const { spec, result } of docTests) {
  const rawTitle = spec.title.replace('@doc', '').trim();
  const slug = slugify(rawTitle);

  const outDir = path.join(docsStaticDir, slug);
  ensureDir(outDir);

  const steps = flattenSteps(result.steps);

  // Attachments include video/trace paths when enabled.
  const videoAtt = (result.attachments || []).find(a => a.name === 'video' && a.path);
  const traceAtt = (result.attachments || []).find(a => a.name === 'trace' && a.path);

  const manifest = {
    title: rawTitle,
    slug,
    recordedAt: new Date().toISOString(),
    steps,
    artifacts: {
      video: videoAtt ? `/scenarios/${slug}/video.webm` : null,
      trace: traceAtt ? `/scenarios/${slug}/trace.zip` : null
    }
  };

  published.push({ title: manifest.title, slug: manifest.slug, recordedAt: manifest.recordedAt });

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  if (videoAtt?.path) fs.copyFileSync(videoAtt.path, path.join(outDir, 'video.webm'));
  if (traceAtt?.path) fs.copyFileSync(traceAtt.path, path.join(outDir, 'trace.zip'));

  console.log(`Published scenario: ${slug}`);
}

fs.writeFileSync(
    path.join(docsStaticDir, 'index.json'),
    JSON.stringify(published.sort((a,b)=>a.title.localeCompare(b.title)), null, 2)
  );
  

console.log(`Done. Scenarios published to: ${docsStaticDir}`);
