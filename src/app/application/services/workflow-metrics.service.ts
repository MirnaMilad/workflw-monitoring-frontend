import { Injectable, Signal } from '@angular/core';
import { WorkflowOverview } from '../../domain/models/workflow-overview.model';
import { PollingService } from './polling.service';

@Injectable({
  providedIn: 'root',
})
export class WorkflowMetricsService {
  private readonly OVERVIEW_ENDPOINT: string = '/stats/overview';
  private readonly POLLING_INTERVAL_MS: number = 5000; // 5 seconds

  private readonly poller: {
    data: Signal<WorkflowOverview | null>;
    start: () => void;
    stop: () => void;
  };

  readonly overview: Signal<WorkflowOverview | null>;

  constructor(private readonly pollingService: PollingService) {
    this.poller = this.pollingService.createPoller<WorkflowOverview>(
      this.OVERVIEW_ENDPOINT,
      this.POLLING_INTERVAL_MS,
    );
    this.overview = this.poller.data;
  }

  startPolling(): void {
    this.poller.start();
  }

  stopPolling(): void {
    this.poller.stop();
  }
}
