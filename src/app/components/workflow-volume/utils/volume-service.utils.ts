import { TimeRange, WorkflowVolumeData } from '../../../domain/models/workflow-volume.model';

export interface TimelineEvent {
  timestamp: string;
  type: string;
  workflowId?: string;
}

export function getHoursFromRange(range: TimeRange): number {
  switch (range) {
    case '6h':
      return 6;
    case '12h':
      return 12;
    case '24h':
      return 24;
    default:
      return 24;
  }
}

export function calculateVolumeFromEvents(
  events: TimelineEvent[],
  timeRange: TimeRange,
): WorkflowVolumeData[] {
  const hours: number = getHoursFromRange(timeRange);
  const now: Date = new Date();
  const cutoffTime: Date = new Date(now.getTime() - hours * 60 * 60 * 1000);

  // Filter events within time range
  const filteredEvents: TimelineEvent[] = events.filter((event: TimelineEvent) => {
    const eventTime: Date = new Date(event.timestamp);
    return eventTime >= cutoffTime;
  });

  // Group by hour
  const volumeMap: Map<number, WorkflowVolumeData> = new Map<number, WorkflowVolumeData>();

  for (let i: number = 0; i < hours; i++) {
    const hourTime: Date = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour: number = hourTime.getHours();
    if (!volumeMap.has(hour)) {
      volumeMap.set(hour, {
        timestamp: hourTime.toISOString(),
        count: 0,
        hour,
      });
    }
  }

  // Count events per hour
  filteredEvents.forEach((event: TimelineEvent) => {
    const eventTime: Date = new Date(event.timestamp);
    const hour: number = eventTime.getHours();
    const existing: WorkflowVolumeData | undefined = volumeMap.get(hour);
    if (existing) {
      existing.count++;
    }
  });

  // Convert to array and sort by hour
  return Array.from(volumeMap.values()).sort(
    (a: WorkflowVolumeData, b: WorkflowVolumeData) => a.hour - b.hour,
  );
}
