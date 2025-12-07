export interface WorkflowVolumeData {
  timestamp: string;
  count: number;
  hour: number;
}

export interface WorkflowVolumeResponse {
  volumes: WorkflowVolumeData[];
  timeRange: TimeRange;
}

export type TimeRange = '6h' | '12h' | '24h';

export interface TimeRangeOption {
  label: string;
  value: TimeRange;
  hours: number;
}
