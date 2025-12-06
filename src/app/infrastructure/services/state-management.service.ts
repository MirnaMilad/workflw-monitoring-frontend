// Infrastructure Service - Generic State Management with Signals
import { Injectable, signal, WritableSignal, Signal, computed } from '@angular/core';
import { StatePort } from '../../domain/ports/state.port';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService<T extends { id: string }> implements StatePort<T> {
  private stateSignal: WritableSignal<T[]>;
  private initialState: T[];

  constructor() {
    this.initialState = [];
    this.stateSignal = signal<T[]>(this.initialState);
  }

  // Read-only state
  get state(): Signal<T[]> {
    return this.stateSignal.asReadonly();
  }

  // Computed count
  readonly count: Signal<number> = computed(() => this.stateSignal().length);

  // Get all items
  getAll(): T[] {
    return this.stateSignal();
  }

  // Create/Add item
  create(item: T): void {
    this.stateSignal.update((current: T[]) => [...current, item]);
  }

  // Delete multiple items by IDs
  deleteMany(ids: string[]): void {
    this.stateSignal.update((current: T[]) => current.filter((item: T) => !ids.includes(item.id)));
  }

  reset(): void {
    this.stateSignal.set(this.initialState);
  }
}
