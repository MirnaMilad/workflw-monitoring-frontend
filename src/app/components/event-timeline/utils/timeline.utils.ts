import {
  WorkflowEvent,
  EventStatus,
  mapEventTypeToStatus,
} from '../../../domain/models/event.model';
import { SeriesDataItem } from '../models/series-data-item.model';
import { getStatusColor, getSeverityColor } from './chart.utils';

export function getCSSVariable(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

export function getDeviceType(containerWidth: number): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  return {
    isMobile: containerWidth < 768,
    isTablet: containerWidth >= 768 && containerWidth < 1024,
    isDesktop: containerWidth >= 1024,
  };
}

export function transformEventsToChartData(events: WorkflowEvent[]): {
  xAxisData: string[];
  seriesData: SeriesDataItem[];
} {
  const xAxisData: string[] = events.map((event: WorkflowEvent) =>
    new Date(event.timestamp).toLocaleTimeString(),
  );

  const seriesData: SeriesDataItem[] = events.map(
    (event: WorkflowEvent, index: number): SeriesDataItem => {
      const status: EventStatus = mapEventTypeToStatus(event.type);
      return {
        value: index,
        itemStyle: {
          color: getStatusColor(status),
        },
        name: event.message,
        status,
        timestamp: event.timestamp,
        severity: event.severity,
        workflowId: event.workflowId,
        type: event.type,
      };
    },
  );

  return { xAxisData, seriesData };
}

export function formatTooltip(data: SeriesDataItem): string {
  const date: Date = new Date(data.timestamp);
  const timeStr: string = date.toLocaleString();
  const workflowInfo: string = data.workflowId ? `Workflow: ${data.workflowId}<br/>` : '';

  return `
    <div style="padding: 8px;">
      <strong>${data.name}</strong><br/>
      <span style="color: ${getStatusColor(data.status)}">● ${data.status.toUpperCase()}</span><br/>
      ${workflowInfo}Type: ${data.type}<br/>
      Severity: <span style="color: ${getSeverityColor(data.severity)}">${data.severity.toUpperCase()}</span><br/>
      Time: ${timeStr}
    </div>
  `;
}

export function calculateAutoScrollPosition(
  eventCount: number,
  threshold: number,
): {
  start: number;
  end: number;
} {
  return {
    start: Math.max(0, ((eventCount - threshold) / eventCount) * 100),
    end: 100,
  };
}

export function filterEventsByCategory(
  events: WorkflowEvent[],
  filter: EventStatus | 'all',
): WorkflowEvent[] {
  if (filter === 'all') {
    return events;
  }
  return events.filter((event: WorkflowEvent) => {
    const status: EventStatus = mapEventTypeToStatus(event.type);
    return status === filter;
  });
}
