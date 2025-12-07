import { Injectable, signal, WritableSignal, Signal } from '@angular/core';
import { ApiService } from '../../infrastructure/adapters/api.service';

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Creates a polling mechanism for any API endpoint
   * @param endpoint - The API endpoint to poll
   * @param intervalMs - Polling interval in milliseconds
   * @returns Object with signal, start, and stop methods
   */
  createPoller<T>(
    endpoint: string,
    intervalMs: number = 5000,
  ): {
    data: Signal<T | null>;
    start: () => void;
    stop: () => void;
    updateInterval: (newIntervalMs: number) => void;
    refresh: () => void;
  } {
    const dataSignal: WritableSignal<T | null> = signal<T | null>(null);
    let pollingInterval: ReturnType<typeof setInterval> | null = null;
    let currentInterval: number = intervalMs;

    const fetchData: () => void = (): void => {
      this.apiService.get<T>(endpoint).subscribe({
        next: (response: T) => {
          dataSignal.set(response);
        },
        error: (error: Error) => {
          console.error(`Error fetching data from ${endpoint}:`, error);
        },
      });
    };

    const start: () => void = (): void => {
      // Fetch immediately
      fetchData();

      // Then poll at intervals
      if (!pollingInterval) {
        pollingInterval = setInterval(() => {
          fetchData();
        }, currentInterval);
      }
    };

    const stop: () => void = (): void => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    };

    const updateInterval: (newIntervalMs: number) => void = (newIntervalMs: number): void => {
      currentInterval = newIntervalMs;
      const wasRunning: boolean = pollingInterval !== null;
      if (wasRunning) {
        stop();
        start();
      }
    };

    const refresh: () => void = (): void => {
      fetchData();
    };

    return {
      data: dataSignal.asReadonly(),
      start,
      stop,
      updateInterval,
      refresh,
    };
  }
}
