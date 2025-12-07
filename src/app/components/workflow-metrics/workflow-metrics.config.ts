import { MetricCard, WorkflowOverview } from '../../domain/models/workflow-overview.model';

export interface MetricConfig {
  title: string;
  icon: string;
  getValue: (overview: WorkflowOverview) => string | number;
  getStatus: (overview: WorkflowOverview) => 'success' | 'warning' | 'error' | 'info';
}

export const METRICS_CONFIG: MetricConfig[] = [
  {
    title: 'Total Workflows Today',
    icon: '📊',
    getValue: (overview: WorkflowOverview) => overview.totalWorkflowsToday,
    getStatus: () => 'info',
  },
  {
    title: 'Avg Cycle Time',
    icon: '⏱️',
    getValue: (overview: WorkflowOverview) => `${overview.avgCycleTimeHours.toFixed(1)}h`,
    getStatus: (overview: WorkflowOverview) =>
      overview.avgCycleTimeHours > 12 ? 'warning' : 'success',
  },
  {
    title: 'SLA Compliance',
    icon: '✅',
    getValue: (overview: WorkflowOverview) => `${overview.slaCompliancePercent.toFixed(1)}%`,
    getStatus: (overview: WorkflowOverview) =>
      overview.slaCompliancePercent >= 95
        ? 'success'
        : overview.slaCompliancePercent >= 90
          ? 'warning'
          : 'error',
  },
  {
    title: 'Active Anomalies',
    icon: '⚠️',
    getValue: (overview: WorkflowOverview) => overview.activeAnomaliesCount,
    getStatus: (overview: WorkflowOverview) =>
      overview.activeAnomaliesCount === 0
        ? 'success'
        : overview.activeAnomaliesCount < 5
          ? 'warning'
          : 'error',
  },
];

export function buildMetricCards(overview: WorkflowOverview): MetricCard[] {
  return METRICS_CONFIG.map((config: MetricConfig) => ({
    title: config.title,
    icon: config.icon,
    value: config.getValue(overview),
    status: config.getStatus(overview),
  }));
}
