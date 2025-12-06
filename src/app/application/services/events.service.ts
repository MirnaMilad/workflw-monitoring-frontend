// Application Service - Events Service with Optimistic Updates
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkflowEvent } from '../../domain/models/event.model';
import { EventsStateService } from '../../infrastructure/services/events-state.service';
import { SseEventStreamAdapter } from '../../infrastructure/adapters/sse-event-stream.adapter';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService implements OnDestroy {
  private eventSubscription: Subscription | null = null;
  private readonly SSE_URL: string = `${environment.baseUrl}/events`;

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
        this.eventsState.addEvent(event);
      },
      error: (error: Error) => {
        console.error('Event stream error:', error);
      },
      complete: () => {
        /* empty */
      },
    });
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
