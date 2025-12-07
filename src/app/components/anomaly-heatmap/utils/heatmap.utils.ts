import { Anomaly, AnomalySeverity, HeatmapDataPoint } from '../../../domain/models/anomaly.model';

export function getSeverityColor(severity: AnomalySeverity): string {
  const colors: Record<AnomalySeverity, string> = {
    low: '#3b82f6', // Blue
    medium: '#f59e0b', // Orange
    high: '#ef4444', // Red
    critical: '#991b1b', // Dark Red
  };
  return colors[severity];
}

export function getSeverityLevel(severity: AnomalySeverity): number {
  const levels: Record<AnomalySeverity, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return levels[severity];
}

export function groupAnomaliesByHourAndSeverity(anomalies: Anomaly[]): HeatmapDataPoint[] {
  const grouped: Map<string, HeatmapDataPoint> = new Map<string, HeatmapDataPoint>();

  anomalies.forEach((anomaly: Anomaly) => {
    const date: Date = new Date(anomaly.timestamp);
    const hour: number = date.getHours();
    const key: string = `${hour}-${anomaly.severity}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        hour,
        severity: anomaly.severity,
        count: 0,
        anomalies: [],
      });
    }

    const dataPoint: HeatmapDataPoint = grouped.get(key)!;
    dataPoint.count++;
    dataPoint.anomalies.push(anomaly);
  });

  return Array.from(grouped.values());
}

export function getHeatmapIntensity(count: number, maxCount: number): number {
  if (maxCount === 0) return 0;
  return count / maxCount;
}
