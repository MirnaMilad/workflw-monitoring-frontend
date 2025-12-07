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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { WorkflowVolumeService } from '../../application/services/workflow-volume.service';
import { WorkflowVolumeResponse, TimeRange } from '../../domain/models/workflow-volume.model';
import { transformVolumeData, VolumeChartDataPoint } from './utils/volume-chart.utils';
import { getVolumeChartOption } from './workflow-volume.config';
import { TIME_RANGE_OPTIONS } from './models/volume-chart.model';
import { getCSSVariable, getDeviceType } from '../anomaly-heatmap/utils/component.utils';

@Component({
  selector: 'app-workflow-volume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-volume.component.html',
  styleUrls: ['./workflow-volume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowVolumeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('volumeChartContainer', { static: false }) volumeChartContainer!: ElementRef;

  private chart: echarts.ECharts | null = null;
  private readonly volumeService: WorkflowVolumeService = inject(WorkflowVolumeService);

  readonly timeRangeOptions: typeof TIME_RANGE_OPTIONS = TIME_RANGE_OPTIONS;

  constructor() {
    effect(() => {
      const volumeData: WorkflowVolumeResponse | null = this.volumeService.volumeData();
      if (this.chart && volumeData) {
        this.updateChart(volumeData);
      }
    });
  }

  ngOnInit(): void {
    this.volumeService.startPolling();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.volumeService.stopPolling();
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.chart) {
      this.chart.dispose();
    }
  }

  private initChart(): void {
    if (!this.volumeChartContainer) return;

    this.chart = echarts.init(this.volumeChartContainer.nativeElement, undefined, {
      renderer: 'canvas',
      width: 'auto',
      height: 'auto',
    });

    const volumeData: WorkflowVolumeResponse | null = this.volumeService.volumeData();
    if (volumeData) {
      this.updateChart(volumeData);
    } else {
      // Initialize with empty data to show chart structure
      this.updateChart({ volumes: [], timeRange: this.volumeService.timeRange() });
    }

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }

  private updateChart(volumeData: WorkflowVolumeResponse): void {
    if (!this.chart) return;

    const dataPoints: VolumeChartDataPoint[] =
      volumeData.volumes.length > 0 ? transformVolumeData(volumeData.volumes) : [];

    // Responsive sizing based on container width
    const containerWidth: number = this.volumeChartContainer.nativeElement.offsetWidth;
    const { isMobile, isTablet }: { isMobile: boolean; isTablet: boolean } =
      getDeviceType(containerWidth);

    const option: ReturnType<typeof getVolumeChartOption> = getVolumeChartOption(
      dataPoints,
      isMobile,
      isTablet,
      getCSSVariable,
    );

    this.chart.setOption(option, true);
  }

  get selectedTimeRange(): TimeRange {
    return this.volumeService.timeRange();
  }

  onTimeRangeChange(range: TimeRange): void {
    this.volumeService.setTimeRange(range);
  }
}
