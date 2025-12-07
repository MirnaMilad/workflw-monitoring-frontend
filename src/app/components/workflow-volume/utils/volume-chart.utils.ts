import { WorkflowVolumeData } from '../../../domain/models/workflow-volume.model';

export interface VolumeChartDataPoint {
  timestamp: string;
  count: number;
  hour: string;
}

export function transformVolumeData(volumes: WorkflowVolumeData[]): VolumeChartDataPoint[] {
  return volumes.map((volume: WorkflowVolumeData) => ({
    timestamp: volume.timestamp,
    count: volume.count,
    hour: `${volume.hour}:00`,
  }));
}

export function getMaxVolume(volumes: WorkflowVolumeData[]): number {
  if (volumes.length === 0) return 0;
  return Math.max(...volumes.map((v: WorkflowVolumeData) => v.count));
}
