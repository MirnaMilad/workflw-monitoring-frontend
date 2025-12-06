import { EventStatus } from '../../../domain/models/event.model';

export interface SeriesDataItem {
  value: number;
  itemStyle: { color: string };
  name: string;
  status: EventStatus;
  timestamp: string;
  severity: string;
  workflowId?: string;
  type: string;
}
