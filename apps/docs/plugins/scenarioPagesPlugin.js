const fs = require('node:fs');
const path = require('node:path');

function listScenarioSlugs(staticDir) {
  const scenariosDir = path.join(staticDir, 'scenarios');
  if (!fs.existsSync(scenariosDir)) return [];

  return fs
    .readdirSync(scenariosDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => fs.existsSync(path.join(scenariosDir, d.name, 'manifest.json')))
    .map(d => d.name);
}

function loadManifest(staticDir, slug) {
  const manifestPath = path.join(staticDir, 'scenarios', slug, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return null;
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

module.exports = function scenarioPagesPlugin(context, options) {
  return {
    name: 'scenario-pages-plugin',
    async contentLoaded({ actions }) {
      const { addRoute, createData, setGlobalData } = actions;

      const staticDir = context.siteDir + '/static';
      const slugs = listScenarioSlugs(staticDir);
      
      // Load all manifests at build time
      const allManifests = {};
      for (const slug of slugs) {
        const manifest = loadManifest(staticDir, slug);
        if (manifest) {
          allManifests[slug] = manifest;
        }
      }

      // Create a single data file with all manifests for static access
      await createData('allScenarioManifests.json', JSON.stringify(allManifests, null, 2));
      
      // Also set global data for easy access via useGlobalData
      setGlobalData({ allManifests, slugs });

      for (const slug of slugs) {
        addRoute({
          path: `/${slug}`,
          component: '@site/src/pages/[slug].tsx',
          exact: true,
        });
      }

      // Optional: index page listing all scenarios
      addRoute({
        path: '/',
        component: '@site/src/pages/index.tsx',
        exact: true,
      });
    },
  };
};
