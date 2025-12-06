// Infrastructure Service - Events State Management with Signals
import { Injectable, Signal } from '@angular/core';
import { WorkflowEvent } from '../../domain/models/event.model';
import { StateManagementService } from './state-management.service';

@Injectable({
  providedIn: 'root',
})
export class EventsStateService {
  private readonly MAX_EVENTS: number = 50;
  private eventStore: StateManagementService<WorkflowEvent> =
    new StateManagementService<WorkflowEvent>();

  // Read-only state - all events
  readonly events: Signal<WorkflowEvent[]> = this.eventStore.state;
  readonly eventCount: Signal<number> = this.eventStore.count;

  // Get all events
  getAll(): WorkflowEvent[] {
    return this.eventStore.getAll();
  }

  // Add single event
  addEvent(event: WorkflowEvent): void {
    this.eventStore.create(event);
    this.enforceMaxEvents();
  }

  // Reset to initial state
  reset(): void {
    this.eventStore.reset();
  }

  // Enforce max events limit
  private enforceMaxEvents(): void {
    const currentEvents: WorkflowEvent[] = this.eventStore.getAll();
    if (currentEvents.length > this.MAX_EVENTS) {
      const eventsToRemove: number = currentEvents.length - this.MAX_EVENTS;
      const idsToDelete: string[] = currentEvents
        .slice(0, eventsToRemove)
        .map((e: WorkflowEvent) => e.id);
      this.eventStore.deleteMany(idsToDelete);
    }
  }
}
