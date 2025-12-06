// Port (Interface) - Defines contract for state management
import { Signal } from '@angular/core';

export interface StatePort<T extends { id: string }> {
  state: Signal<T[]>;

  getAll(): T[];
}
