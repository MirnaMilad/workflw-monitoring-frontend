import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MetricCard, WorkflowOverview } from '../../domain/models/workflow-overview.model';
import { WorkflowMetricsService } from '../../application/services/workflow-metrics.service';
import { buildMetricCards } from './workflow-metrics.config';

@Component({
  selector: 'app-workflow-metrics',
  standalone: true,
  imports: [],
  templateUrl: './workflow-metrics.component.html',
  styleUrls: ['./workflow-metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowMetricsComponent implements OnInit, OnDestroy {
  private readonly metricsService: WorkflowMetricsService = inject(WorkflowMetricsService);

  readonly metrics: () => MetricCard[] = computed<MetricCard[]>(() => {
    const overview: WorkflowOverview | null = this.metricsService.overview();
    if (!overview) return [];

    return buildMetricCards(overview);
  });

  ngOnInit(): void {
    this.metricsService.startPolling();
  }

  ngOnDestroy(): void {
    this.metricsService.stopPolling();
  }
}
