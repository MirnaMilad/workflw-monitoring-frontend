import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {
  WorkflowVolumeResponse,
  TimeRange,
  WorkflowVolumeData,
} from '../../domain/models/workflow-volume.model';
import { PollingService } from './polling.service';
import {
  TimelineEvent,
  calculateVolumeFromEvents,
} from '../../components/workflow-volume/utils/volume-service.utils';

interface TimelineResponse {
  events: TimelineEvent[];
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowVolumeService {
  private readonly TIMELINE_ENDPOINT: string = '/stats/timeline';
  private readonly POLLING_INTERVAL_MS: number = 10000; // 10 seconds

  private readonly selectedTimeRange: WritableSignal<TimeRange> = signal('24h');

  private poller: {
    data: Signal<TimelineResponse | null>;
    start: () => void;
    stop: () => void;
    updateInterval: (newIntervalMs: number) => void;
    refresh: () => void;
  } | null = null;

  constructor(private readonly pollingService: PollingService) {
    this.initializePoller();
  }

  private initializePoller(): void {
    this.poller = this.pollingService.createPoller<TimelineResponse>(
      this.TIMELINE_ENDPOINT,
      this.POLLING_INTERVAL_MS,
    );
  }

  volumeData(): WorkflowVolumeResponse | null {
    const timelineData: TimelineResponse | null = this.poller?.data() || null;
    if (!timelineData || !timelineData.events) {
      return null;
    }

    const volumes: WorkflowVolumeData[] = calculateVolumeFromEvents(
      timelineData.events,
      this.selectedTimeRange(),
    );

    return {
      volumes,
      timeRange: this.selectedTimeRange(),
    };
  }

  timeRange(): TimeRange {
    return this.selectedTimeRange();
  }

  setTimeRange(range: TimeRange): void {
    this.selectedTimeRange.set(range);
    // Reinitialize poller with new time range
    this.stopPolling();
    this.initializePoller();
    this.startPolling();
  }

  startPolling(intervalMs?: number): void {
    if (intervalMs) {
      this.poller?.updateInterval(intervalMs);
    }
    this.poller?.start();
  }

  stopPolling(): void {
    this.poller?.stop();
  }

  refresh(): void {
    this.poller?.refresh();
  }
}
