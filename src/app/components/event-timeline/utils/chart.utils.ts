export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#22c55e';
    case 'pending':
      return '#eab308';
    case 'anomaly':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#10b981';
    default:
      return '#6b7280';
  }
}
