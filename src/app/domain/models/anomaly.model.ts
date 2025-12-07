export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';
export type AnomalyType =
  | 'Unusual Delay'
  | 'SLA Breach'
  | 'System Error'
  | 'Performance Degradation';

export interface Anomaly {
  id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  timestamp: string;
  description: string;
}

export interface AnomaliesResponse {
  anomalies: Anomaly[];
}

export interface HeatmapDataPoint {
  hour: number;
  severity: AnomalySeverity;
  count: number;
  anomalies: Anomaly[];
}
