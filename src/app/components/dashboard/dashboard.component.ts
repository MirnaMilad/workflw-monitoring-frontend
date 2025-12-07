import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WorkflowMetricsComponent } from '../workflow-metrics/workflow-metrics.component';
import { EventTimelineComponent } from '../event-timeline/event-timeline.component';
import { AnomalyHeatmapComponent } from '../anomaly-heatmap/anomaly-heatmap.component';
import { WorkflowVolumeComponent } from '../workflow-volume/workflow-volume.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    WorkflowMetricsComponent,
    EventTimelineComponent,
    AnomalyHeatmapComponent,
    WorkflowVolumeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
