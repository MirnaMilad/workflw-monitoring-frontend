import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import * as echarts from 'echarts';
import { Anomaly, HeatmapDataPoint } from '../../domain/models/anomaly.model';
import { groupAnomaliesByHourAndSeverity } from './utils/heatmap.utils';
import { getCSSVariable, formatDate, getMaxCount, getDeviceType } from './utils/component.utils';
import { AnomalyService } from '../../application/services/anomaly.service';
import { getHeatmapChartOption } from './anomaly-heatmap.config';

@Component({
  selector: 'app-anomaly-heatmap',
  standalone: true,
  imports: [],
  templateUrl: './anomaly-heatmap.component.html',
  styleUrls: ['./anomaly-heatmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnomalyHeatmapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heatmapContainer', { static: false }) heatmapContainer!: ElementRef;

  private chart: echarts.ECharts | null = null;
  private readonly anomalyService: AnomalyService = inject(AnomalyService);

  readonly selectedCell: WritableSignal<HeatmapDataPoint | null> = signal(null);
  readonly showDetails: WritableSignal<boolean> = signal(false);

  constructor() {
    effect(() => {
      const anomalies: Anomaly[] = this.anomalyService.anomalies();
      if (this.chart) {
        this.updateChart(anomalies);
      }
    });
  }

  ngOnInit(): void {
    this.anomalyService.startPolling();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    if (!this.heatmapContainer) return;

    this.chart = echarts.init(this.heatmapContainer.nativeElement, undefined, {
      renderer: 'canvas',
      width: 'auto',
      height: 'auto',
    });
    this.updateChart(this.anomalyService.anomalies());

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }

  private updateChart(anomalies: Anomaly[]): void {
    if (!this.chart) return;

    const dataPoints: HeatmapDataPoint[] = groupAnomaliesByHourAndSeverity(anomalies);
    const maxCount: number = getMaxCount(dataPoints);

    // Responsive sizing based on container width
    const containerWidth: number = this.heatmapContainer.nativeElement.offsetWidth;
    const { isMobile, isTablet }: { isMobile: boolean; isTablet: boolean } =
      getDeviceType(containerWidth);

    const option: ReturnType<typeof getHeatmapChartOption> = getHeatmapChartOption(
      dataPoints,
      maxCount,
      isMobile,
      isTablet,
      getCSSVariable,
    );

    this.chart.setOption(option, true);

    this.chart.on(
      'click',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (params: any) => {
        if (params.componentType === 'series') {
          const dataPoint: HeatmapDataPoint = params.data[3] as HeatmapDataPoint;
          this.selectedCell.set(dataPoint);
          this.showDetails.set(true);
        }
      },
    );
  }

  closeDetails(): void {
    this.showDetails.set(false);
  }

  formatDate(timestamp: string): string {
    return formatDate(timestamp);
  }

  ngOnDestroy(): void {
    this.anomalyService.stopPolling();
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
