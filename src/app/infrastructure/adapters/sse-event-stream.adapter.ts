// Infrastructure Adapter - SSE Event Stream Service
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { WorkflowEvent } from '../../domain/models/event.model';
import { EventStreamPort } from '../../domain/ports/event-stream.port';

@Injectable({
  providedIn: 'root',
})
export class SseEventStreamAdapter implements EventStreamPort, OnDestroy {
  private eventSource: EventSource | null = null;
  private eventsSubject: Subject<WorkflowEvent> = new Subject<WorkflowEvent>();

  connect(url: string): Observable<WorkflowEvent> {
    if (!this.eventSource) {
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event: MessageEvent): void => {
        try {
          const data: WorkflowEvent = JSON.parse(event.data);
          if (data.type !== 'connected') {
            this.eventsSubject.next(data);
          }
        } catch (error) {
          console.error('Error parsing event data:', error);
        }
      };

      this.eventSource.onerror = (error: Event): void => {
        console.error('SSE connection error:', error);
        this.disconnect();
      };
    }

    return this.eventsSubject
      .asObservable()
      .pipe(filter((event: WorkflowEvent) => event.type !== 'connected'));
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.eventsSubject.complete();
  }
}
