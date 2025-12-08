// Application Service - Events Service with Optimistic Updates
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkflowEvent } from '../../domain/models/event.model';
import { EventsStateService } from '../../infrastructure/services/events-state.service';
import { SseEventStreamAdapter } from '../../infrastructure/adapters/sse-event-stream.adapter';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService implements OnDestroy {
  private eventSubscription: Subscription | null = null;
  private readonly SSE_URL: string = `${environment.baseUrl}/events`;
  private readonly toastService: ToastService = inject(ToastService);
  private isPaused: boolean = false;

  constructor(
    private eventsState: EventsStateService,
    private eventStream: SseEventStreamAdapter,
  ) {}

  connectToEventStream(): void {
    if (this.eventSubscription) {
      return;
    }

    this.eventSubscription = this.eventStream.connect(this.SSE_URL).subscribe({
      next: (event: WorkflowEvent) => {
        if (!this.isPaused) {
          this.eventsState.addEvent(event);
          this.showEventNotification(event);
        }
      },
      error: (error: Error) => {
        console.error('Event stream error:', error);
        this.toastService.error('Connection to event stream lost');
      },
      complete: () => {
        /* empty */
      },
    });
  }

  private showEventNotification(event: WorkflowEvent): void {
    const message: string = `Workflow: ${event.workflowId} - ${event.type}`;

    switch (event.type) {
      case 'workflow_completed':
        this.toastService.success(message, 4000);
        break;
      case 'system_alert':
        this.toastService.error(`🚨 ${message} (${event.severity})`, 6000);
        break;
      case 'approval_pending':
        this.toastService.info(message, 3000);
        break;
      default:
        this.toastService.info(message, 3000);
    }
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  disconnectFromEventStream(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = null;
    }
    this.eventStream.disconnect();
  }

  ngOnDestroy(): void {
    this.disconnectFromEventStream();
  }
}
