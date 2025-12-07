import { AnomalySeverity } from '../../../domain/models/anomaly.model';

export interface HeatmapCell {
  hour: string;
  severity: string;
  value: number;
  count: number;
  anomalyIds: string[];
}

export const SEVERITY_ORDER: AnomalySeverity[] = ['critical', 'high', 'medium', 'low'];

export const SEVERITY_LABELS: Record<AnomalySeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const HOURS_IN_DAY: number = 24;
