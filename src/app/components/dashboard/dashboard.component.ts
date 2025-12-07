import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { WorkflowMetricsComponent } from '../workflow-metrics/workflow-metrics.component';
import { EventTimelineComponent } from '../event-timeline/event-timeline.component';
import { AnomalyHeatmapComponent } from '../anomaly-heatmap/anomaly-heatmap.component';
import { WorkflowVolumeComponent } from '../workflow-volume/workflow-volume.component';
import { RefreshControlComponent } from '../refresh-button/refresh-control.component';
import { RefreshConfig } from '../refresh-button/refresh-config.model';
import { WorkflowMetricsService } from '../../application/services/workflow-metrics.service';
import { AnomalyService } from '../../application/services/anomaly.service';
import { WorkflowVolumeService } from '../../application/services/workflow-volume.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    WorkflowMetricsComponent,
    EventTimelineComponent,
    AnomalyHeatmapComponent,
    WorkflowVolumeComponent,
    RefreshControlComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly metricsService: WorkflowMetricsService = inject(WorkflowMetricsService);
  private readonly anomalyService: AnomalyService = inject(AnomalyService);
  private readonly volumeService: WorkflowVolumeService = inject(WorkflowVolumeService);

  onRefreshConfigChange(config: RefreshConfig): void {
    const intervalMs: number = config.interval * 1000;

    if (config.autoRefresh) {
      this.metricsService.startPolling(intervalMs);
      this.anomalyService.startPolling(intervalMs);
      this.volumeService.startPolling(intervalMs);
    } else {
      this.metricsService.stopPolling();
      this.anomalyService.stopPolling();
      this.volumeService.stopPolling();
    }
  }

  onManualRefresh(): void {
    this.metricsService.refresh();
    this.anomalyService.refresh();
    this.volumeService.refresh();
  }
}
