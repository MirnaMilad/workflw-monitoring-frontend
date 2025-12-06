// Domain Model - Core Business Entity
export interface WorkflowEvent {
  id: string;
  type: 'system_alert' | 'approval_pending' | 'workflow_completed' | 'connected';
  severity: 'low' | 'medium' | 'critical';
  message: string;
  timestamp: string;
  workflowId?: string;
}

export type EventStatus = 'completed' | 'pending' | 'anomaly';

export function mapEventTypeToStatus(type: string): EventStatus {
  switch (type) {
    case 'workflow_completed':
      return 'completed';
    case 'approval_pending':
      return 'pending';
    case 'system_alert':
      return 'anomaly';
    default:
      return 'pending';
  }
}
