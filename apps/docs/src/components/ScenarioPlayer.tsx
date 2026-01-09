import { FC, useRef } from 'react';

type ScenarioPlayerProps = { manifest: {
  title: string;
  slug: string;
    recordedAt: string;
    steps: { title: string; durationMs?: number }[];
    artifacts: { video: string | null; trace: string | null };
  };
};

const calculateStepStartTimes = (steps: { title: string; durationMs?: number }[]): number[] => {
  const startTimes: number[] = [];
  let cumulativeTime = 0;
  
  for (const step of steps) {
    startTimes.push(cumulativeTime);
    if (step.durationMs) {
      cumulativeTime += step.durationMs / 1000;
    }
  }
  
  return startTimes;
};

export const ScenarioPlayer: FC<ScenarioPlayerProps> = ({ manifest }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepStartTimes = calculateStepStartTimes(manifest.steps);

  const handleStepClick = (startTimeSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTimeSeconds;
    }
  };

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
        <video ref={videoRef} controls style={{ width: '100%', marginTop: 12, borderRadius: 12 }}>
          <source src={manifest.artifacts.video} type="video/webm" />
        </video>
      ) : (
        <div style={{ marginTop: 12 }}>No video found.</div>
      )}

      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Steps</div>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {manifest.steps.map((s, i) => {
            const startTime = stepStartTimes[i];
            const isClickable = s.durationMs !== undefined;
            
            return (
              <li
                key={i}
                onClick={() => isClickable && handleStepClick(startTime)}
                style={{
                  cursor: isClickable ? 'pointer' : 'default',
                  padding: '4px 8px',
                  marginLeft: '-8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  if (isClickable) {
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {isClickable && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    style={{ opacity: 0.6, flexShrink: 0 }}
                  >
                    <path d="M6 4l6 4-6 4V4z" />
                  </svg>
                )}
                <span>{s.title}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
