import { EventStatus } from '../../../domain/models/event.model';

export interface CategoryFilter {
  label: string;
  value: EventStatus | 'all';
  active: boolean;
}

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { label: 'All', value: 'all', active: true },
  { label: 'Completed', value: 'completed', active: false },
  { label: 'Pending', value: 'pending', active: false },
  { label: 'Anomaly', value: 'anomaly', active: false },
];
