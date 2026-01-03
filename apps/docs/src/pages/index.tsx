import { FC } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useGlobalData from '@docusaurus/useGlobalData';

type ManifestSummary = { title: string; slug: string; recordedAt: string };

const HowToIndex: FC = () => {
  const globalData = useGlobalData();
  const { allManifests } = (globalData['scenario-pages-plugin']['default'] || {}) as {
    allManifests: Record<string, ManifestSummary & { steps: any[]; artifacts: any }>;
  };
  
  const items: ManifestSummary[] = Object.values(allManifests || {}).map(({ title, slug, recordedAt }) => ({
    title,
    slug,
    recordedAt,
  }));

  return (
    <Layout title="How-To Guides" description="Generated How-To guides from scenarios">
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '24px 16px' }}>
        <h1>How-To Guides</h1>
        <p style={{ opacity: 0.8 }}>
          These pages are generated automatically from Playwright doc scenarios.
        </p>

        <ul>
          {items.map(item => (
            <li key={item.slug}>
              <Link to={`/${item.slug}`}>{item.title}</Link>{' '}
              <span style={{ opacity: 0.7, fontSize: 14 }}>
                ({new Date(item.recordedAt).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}

export default HowToIndex;