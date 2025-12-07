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
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { EventsService } from '../../application/services/events.service';
import { EventsStateService } from '../../infrastructure/services/events-state.service';
import { ThemeService } from '../../application/services/theme.service';
import { WorkflowEvent, EventStatus } from '../../domain/models/event.model';
import { SeriesDataItem } from './models/series-data-item.model';
import { CategoryFilter, CATEGORY_FILTERS } from './models/category-filter.model';
import {
  RESPONSIVE_CONFIG,
  AUTO_SCROLL_THRESHOLD,
  buildChartOption,
} from './event-timeline.config';
import {
  getCSSVariable,
  getDeviceType,
  transformEventsToChartData,
  formatTooltip,
  calculateAutoScrollPosition,
  filterEventsByCategory,
} from './utils/timeline.utils';

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
  private readonly themeService: ThemeService = inject(ThemeService);

  readonly categoryFilters: WritableSignal<CategoryFilter[]> = signal(CATEGORY_FILTERS);
  readonly activeFilter: WritableSignal<EventStatus | 'all'> = signal('all');

  constructor() {
    // Effect to update chart when events or filter change
    effect(() => {
      const currentEvents: WorkflowEvent[] = this.eventsState.events();
      const filter: EventStatus | 'all' = this.activeFilter();
      const filteredEvents: WorkflowEvent[] = filterEventsByCategory(currentEvents, filter);
      if (this.chart) {
        this.updateChart(filteredEvents);
      }
    });

    // Effect to update chart when theme changes
    effect(() => {
      this.themeService.isDarkMode(); // Track theme changes
      if (this.chart) {
        this.updateChart(this.eventsState.events());
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
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.chart) {
      this.chart.dispose();
    }
  }

  private initChart(): void {
    if (!this.chartContainer) return;

    this.chart = echarts.init(this.chartContainer.nativeElement, undefined, {
      renderer: 'canvas',
      width: 'auto',
      height: 'auto',
    });
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

    // Responsive sizing based on container width
    const containerWidth: number = this.chartContainer.nativeElement.offsetWidth;
    const { isMobile, isTablet }: { isMobile: boolean; isTablet: boolean; isDesktop: boolean } =
      getDeviceType(containerWidth);

    // Transform events to chart data
    const { xAxisData, seriesData }: { xAxisData: string[]; seriesData: SeriesDataItem[] } =
      transformEventsToChartData(events);

    // Get responsive configuration
    const responsiveConfig: (typeof RESPONSIVE_CONFIG)['mobile'] =
      RESPONSIVE_CONFIG[isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'];

    // Build chart option using config function
    const option: EChartsOption = buildChartOption(
      xAxisData,
      seriesData,
      responsiveConfig,
      getCSSVariable,
      formatTooltip as (data: unknown) => string,
    ) as EChartsOption;

    this.chart.setOption(option, true);

    // Auto-scroll to the latest event
    if (events.length > AUTO_SCROLL_THRESHOLD) {
      const scrollPosition: { start: number; end: number } = calculateAutoScrollPosition(
        events.length,
        AUTO_SCROLL_THRESHOLD,
      );
      this.chart.dispatchAction({
        type: 'dataZoom',
        ...scrollPosition,
      });
    }
  }

  onFilterChange(filterValue: EventStatus | 'all'): void {
    this.activeFilter.set(filterValue);
    const updatedFilters: CategoryFilter[] = this.categoryFilters().map(
      (filter: CategoryFilter) => ({
        ...filter,
        active: filter.value === filterValue,
      }),
    );
    this.categoryFilters.set(updatedFilters);
  }
}
