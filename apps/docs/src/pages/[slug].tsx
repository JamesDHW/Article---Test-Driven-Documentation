import { FC } from 'react';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import useGlobalData from '@docusaurus/useGlobalData';
import { ScenarioPlayer } from '@site/src/components/ScenarioPlayer';

type Manifest = {
  title: string;
  slug: string;
  recordedAt: string;
  steps: { title: string; durationMs?: number }[];
  artifacts: { video: string | null; trace: string | null };
};

const useSlugFromPath = () => {
  const { pathname } = useLocation();
  const [slug] = pathname.split('/').filter(Boolean);
  return slug ?? '';
};

export const AutoHowToPage: FC = () => {
  const slug = useSlugFromPath();
  const globalData = useGlobalData();
  const { allManifests } = (globalData['scenario-pages-plugin']['default'] || {}) as {
    allManifests: Record<string, Manifest>;
  };
  
  const manifest = slug ? allManifests?.[slug] : null;
  const title = manifest?.title ?? slug;

  return (
    <Layout title={title} description={`How-To Guide: ${title}`}>
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '24px 16px' }}>
        <h1>{title}</h1>

        <p style={{ opacity: 0.8 }}>
          This page was generated from an executable Playwright scenario.
        </p>

        {manifest && <ScenarioPlayer manifest={manifest} />}
      </main>
    </Layout>
  );
}

export default AutoHowToPage;
