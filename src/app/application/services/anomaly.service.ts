import { Injectable, Signal } from '@angular/core';
import { Anomaly, AnomaliesResponse } from '../../domain/models/anomaly.model';
import { PollingService } from './polling.service';

@Injectable({
  providedIn: 'root',
})
export class AnomalyService {
  private readonly ANOMALIES_ENDPOINT: string = '/stats/anomalies';
  private readonly POLLING_INTERVAL_MS: number = 10000; // 10 seconds

  private readonly poller: {
    data: Signal<AnomaliesResponse | null>;
    start: () => void;
    stop: () => void;
    updateInterval: (newIntervalMs: number) => void;
    refresh: () => void;
  };

  constructor(private readonly pollingService: PollingService) {
    this.poller = this.pollingService.createPoller<AnomaliesResponse>(
      this.ANOMALIES_ENDPOINT,
      this.POLLING_INTERVAL_MS,
    );
  }

  anomalies(): Anomaly[] {
    const response: AnomaliesResponse | null = this.poller.data();
    return response?.anomalies || [];
  }

  startPolling(intervalMs?: number): void {
    if (intervalMs) {
      this.poller.updateInterval(intervalMs);
    }
    this.poller.start();
  }

  stopPolling(): void {
    this.poller.stop();
  }

  refresh(): void {
    this.poller.refresh();
  }
}
