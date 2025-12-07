export interface WorkflowOverview {
  totalWorkflowsToday: number;
  avgCycleTimeHours: number;
  slaCompliancePercent: number;
  activeAnomaliesCount: number;
}

export interface MetricCard {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    isPositive: boolean;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
}
