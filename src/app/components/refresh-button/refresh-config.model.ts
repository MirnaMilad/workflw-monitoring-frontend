export interface RefreshConfig {
  autoRefresh: boolean;
  interval: number; // in seconds
}

export const REFRESH_INTERVALS: { label: string; value: number }[] = [
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
];

export const DEFAULT_REFRESH_CONFIG: RefreshConfig = {
  autoRefresh: true,
  interval: 10,
};
