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
        <h1>Test-Driven Documentation</h1>


        <h2 style={{ fontSize: '1.25rem', marginTop: 28, marginBottom: 12 }}>Why this matters</h2>
        <p style={{ opacity: 0.85, marginBottom: 12 }}>
          Test-driven documentation means turning the same flows that check the app into guides people can follow. 
          <br />
          <br />
          That gives you a few practical wins:
        </p>
        <ul style={{ opacity: 0.9, paddingLeft: 20, marginBottom: 28 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Guides stay trustworthy.</strong> What you see is tied to checks that actually pass, so pages are far less likely to drift away from how the product really behaves.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Less busywork.</strong> You are not maintaining a separate manual write-up that has to be remembered every release - when the flow changes, the guide can change with it from the same source.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Better conversations.</strong> Feedback on a guide is feedback on what the product should do, which feeds back into the executable tests and keeps teams and users more aligned.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Focus on the right things.</strong> The checks focus on outcomes that matter to users, not on internal wiring, so you can refactor and evolve the implementation with more confidence that the important behavior still holds.
          </li>
        </ul>
        <h1>How-To Guides</h1>
        <p style={{ opacity: 0.8 }}>
          These pages are generated automatically from executable doc scenarios.
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