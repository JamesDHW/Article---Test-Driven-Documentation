import { FC } from 'react';

type ScenarioPlayerProps = { manifest: {
  title: string;
  slug: string;
    recordedAt: string;
    steps: { title: string; durationMs?: number }[];
    artifacts: { video: string | null; trace: string | null };
  };
};

export const ScenarioPlayer: FC<ScenarioPlayerProps> = ({ manifest }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700 }}>{manifest.title}</div>
          <div style={{ opacity: 0.7, fontSize: 14 }}>Recorded: {new Date(manifest.recordedAt).toLocaleString()}</div>
        </div>
        {manifest.artifacts.trace && (
          <a href={manifest.artifacts.trace} style={{ fontSize: 14 }}>(internal) Trace</a>
        )}
      </div>

      {manifest.artifacts.video ? (
        <video controls style={{ width: '100%', marginTop: 12, borderRadius: 12 }}>
          <source src={manifest.artifacts.video} type="video/webm" />
        </video>
      ) : (
        <div style={{ marginTop: 12 }}>No video found.</div>
      )}

      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Steps</div>
        <ol>
          {manifest.steps.map((s, i) => (
            <li key={i}>{s.title}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
