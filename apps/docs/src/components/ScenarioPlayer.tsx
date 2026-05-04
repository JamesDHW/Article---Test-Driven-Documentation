import { FC, useRef, useState } from 'react';
import { ScenarioManifest } from '@site/src/types/scenarioManifest';

type ScenarioPlayerProps = { manifest: ScenarioManifest };

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

const getActiveStepIndex = (currentTime: number, steps: { title: string; durationMs?: number }[], stepStartTimes: number[]): number | null => {
  for (let i = steps.length - 1; i >= 0; i--) {
    const startTime = stepStartTimes[i];
    const step = steps[i];
    
    if (step.durationMs !== undefined) {
      const endTime = startTime + (step.durationMs / 1000);
      if (currentTime >= startTime && currentTime < endTime) {
        return i;
      }
    }
  }
  return null;
};

const getVideoMimeType = (videoPath: string) => {
  if (videoPath.endsWith('.mp4')) {
    return 'video/mp4';
  }
  if (videoPath.endsWith('.webm')) {
    return 'video/webm';
  }
  if (videoPath.endsWith('.mov')) {
    return 'video/quicktime';
  }
  return undefined;
};

export const ScenarioPlayer: FC<ScenarioPlayerProps> = ({ manifest }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepStartTimes = calculateStepStartTimes(manifest.steps);
  const [currentTime, setCurrentTime] = useState(0);
  const activeStepIndex = getActiveStepIndex(currentTime, manifest.steps, stepStartTimes);

  const handleStepClick = (startTimeSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTimeSeconds;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
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
        <video ref={videoRef} controls onTimeUpdate={handleTimeUpdate} style={{ width: '100%', maxHeight: '50vh', marginTop: 12, borderRadius: 12 }}>
          <source src={manifest.artifacts.video} type={getVideoMimeType(manifest.artifacts.video)} />
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
            const isActive = activeStepIndex === i;
            const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';
            
            const getBackgroundColor = () => {
              if (isActive) {
                return isDark ? 'rgba(0, 159, 255, 0.22)' : 'rgba(0, 159, 255, 0.14)';
              }
              return 'transparent';
            };
            
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
                  backgroundColor: getBackgroundColor(),
                }}
                onMouseEnter={(e) => {
                  if (isClickable && !isActive) {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  } else {
                    e.currentTarget.style.backgroundColor = getBackgroundColor();
                  }
                }}
              >
                {isClickable && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}
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


      {manifest.artifacts.screenshots && manifest.artifacts.screenshots.length > 0 ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screenshots</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
            {manifest.artifacts.screenshots.map((screenshotPath) => (
              <a key={screenshotPath} href={screenshotPath} target="_blank" rel="noreferrer">
                <img
                  src={screenshotPath}
                  alt={`${manifest.title} screenshot`}
                  style={{ width: '100%', borderRadius: 8, display: 'block' }}
                />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
