// Port (Interface) - Defines contract for event streaming
import { Observable } from 'rxjs';
import { WorkflowEvent } from '../models/event.model';

export interface EventStreamPort {
  connect(url: string): Observable<WorkflowEvent>;
  disconnect(): void;
}
