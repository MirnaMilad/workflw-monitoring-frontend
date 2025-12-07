import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WorkflowMetricsComponent } from '../workflow-metrics/workflow-metrics.component';
import { EventTimelineComponent } from '../event-timeline/event-timeline.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WorkflowMetricsComponent, EventTimelineComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
