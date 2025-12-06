import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { EventsService } from '../../application/services/events.service';
import { EventsStateService } from '../../infrastructure/services/events-state.service';
import { WorkflowEvent, mapEventTypeToStatus, EventStatus } from '../../domain/models/event.model';
import { SeriesDataItem } from './models/series-data-item.model';
import { getStatusColor, getSeverityColor } from './utils/chart.utils';

@Component({
  selector: 'app-event-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-timeline.component.html',
  styleUrls: ['./event-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTimelineComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  private chart: echarts.ECharts | null = null;
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly eventsState: EventsStateService = inject(EventsStateService);

  constructor() {
    // Effect to update chart when events change
    effect(() => {
      const currentEvents: WorkflowEvent[] = this.eventsState.events();
      if (this.chart) {
        this.updateChart(currentEvents);
      }
    });
  }

  ngOnInit(): void {
    // Connect to event stream using the application service
    this.eventsService.connectToEventStream();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.eventsService.disconnectFromEventStream();
    if (this.chart) {
      this.chart.dispose();
    }
  }

  private initChart(): void {
    if (!this.chartContainer) return;

    this.chart = echarts.init(this.chartContainer.nativeElement);
    this.updateChart(this.eventsState.events());

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }

  private updateChart(events: WorkflowEvent[]): void {
    if (!this.chart) return;

    const xAxisData: string[] = events.map((event: WorkflowEvent) =>
      new Date(event.timestamp).toLocaleTimeString(),
    );
    const seriesData: SeriesDataItem[] = events.map(
      (event: WorkflowEvent, index: number): SeriesDataItem => {
        const status: EventStatus = mapEventTypeToStatus(event.type);
        return {
          value: index,
          itemStyle: {
            color: getStatusColor(status),
          },
          name: event.message,
          status,
          timestamp: event.timestamp,
          severity: event.severity,
          workflowId: event.workflowId,
          type: event.type,
        };
      },
    );

    const option: EChartsOption = {
      backgroundColor: '#1e293b',
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          if (Array.isArray(params)) return '';
          if (!params || typeof params !== 'object' || !('data' in params)) return '';
          const data: SeriesDataItem = (params as any).data as SeriesDataItem;
          const date: Date = new Date(data.timestamp);
          const timeStr: string = date.toLocaleString();
          const workflowInfo: string = data.workflowId ? `Workflow: ${data.workflowId}<br/>` : '';

          return `
            <div style="padding: 8px;">
              <strong>${data.name}</strong><br/>
              <span style="color: ${getStatusColor(data.status)}">● ${data.status.toUpperCase()}</span><br/>
              ${workflowInfo}Type: ${data.type}<br/>
              Severity: <span style="color: ${getSeverityColor(data.severity)}">${data.severity.toUpperCase()}</span><br/>
              Time: ${timeStr}
            </div>
          `;
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        textStyle: {
          color: '#e2e8f0',
        },
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '10%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          color: '#94a3b8',
          rotate: 45,
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: '#334155',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#1e293b',
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          type: 'scatter',
          data: seriesData,
          symbolSize: 20,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#1e293b',
          },
          emphasis: {
            scale: 1.5,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'line',
          data: seriesData.map((d: SeriesDataItem) => d.value),
          lineStyle: {
            color: '#475569',
            width: 2,
            type: 'dashed',
          },
          symbol: 'none',
          smooth: true,
        },
      ],
    };

    this.chart.setOption(option, true);

    // Auto-scroll to the latest event
    if (events.length > 10) {
      this.chart.dispatchAction({
        type: 'dataZoom',
        start: Math.max(0, ((events.length - 10) / events.length) * 100),
        end: 100,
      });
    }
  }
}
