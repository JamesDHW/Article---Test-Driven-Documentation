export type ScenarioStep = {
  title: string;
  durationMs?: number;
};

export type ScenarioArtifacts = {
  video: string | null;
  trace: string | null;
  screenshots?: string[];
};

export type ScenarioManifest = {
  title: string;
  slug: string;
  recordedAt: string;
  source?: 'playwright' | 'maestro';
  steps: ScenarioStep[];
  artifacts: ScenarioArtifacts;
};
