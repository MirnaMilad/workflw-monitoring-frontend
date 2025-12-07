import type { EChartsOption } from 'echarts';
import { AnomalySeverity, HeatmapDataPoint } from '../../domain/models/anomaly.model';
import { getSeverityColor } from './utils/heatmap.utils';
import { SEVERITY_ORDER, SEVERITY_LABELS, HOURS_IN_DAY } from './models/heatmap.model';

export interface HeatmapChartConfig {
  title: {
    mobile: string;
    desktop: string;
  };
  fontSize: {
    mobile: {
      title: number;
      axis: number;
      axisName: number;
    };
    tablet: {
      title: number;
      axis: number;
      axisName: number;
    };
    desktop: {
      title: number;
      axis: number;
      axisName: number;
    };
  };
  grid: {
    mobile: {
      left: string;
      right: string;
      top: string;
      bottom: string;
    };
    desktop: {
      left: string;
      right: string;
      top: string;
      bottom: string;
    };
  };
  xAxis: {
    mobile: {
      interval: number;
      rotate: number;
      showName: boolean;
    };
    desktop: {
      interval: number;
      rotate: number;
      showName: boolean;
    };
  };
  visualMap: {
    colors: string[];
  };
}

export const HEATMAP_CHART_CONFIG: HeatmapChartConfig = {
  title: {
    mobile: 'Anomaly Heatmap',
    desktop: 'Anomaly Heatmap - Last 24 Hours',
  },
  fontSize: {
    mobile: {
      title: 14,
      axis: 10,
      axisName: 10,
    },
    tablet: {
      title: 16,
      axis: 11,
      axisName: 11,
    },
    desktop: {
      title: 18,
      axis: 12,
      axisName: 12,
    },
  },
  grid: {
    mobile: {
      left: '15%',
      right: '5%',
      top: '18%',
      bottom: '12%',
    },
    desktop: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%',
    },
  },
  xAxis: {
    mobile: {
      interval: 3,
      rotate: 45,
      showName: false,
    },
    desktop: {
      interval: 2,
      rotate: 0,
      showName: true,
    },
  },
  visualMap: {
    colors: ['#e0f2fe', '#0369a1', '#1e3a8a'],
  },
};

export function getHeatmapChartOption(
  dataPoints: HeatmapDataPoint[],
  maxCount: number,
  isMobile: boolean,
  isTablet: boolean,
  getCSSVariable: (variable: string) => string,
): EChartsOption {
  const config: HeatmapChartConfig = HEATMAP_CHART_CONFIG;
  const deviceType: 'mobile' | 'desktop' = isMobile ? 'mobile' : 'desktop';
  const fontSize: HeatmapChartConfig['fontSize']['mobile'] = isMobile
    ? config.fontSize.mobile
    : isTablet
      ? config.fontSize.tablet
      : config.fontSize.desktop;

  const heatmapData: (number | HeatmapDataPoint)[][] = dataPoints.map((point: HeatmapDataPoint) => [
    point.hour,
    SEVERITY_ORDER.indexOf(point.severity),
    point.count,
    point,
  ]);

  return {
    backgroundColor: getCSSVariable('--bg-card'),
    title: {
      text: isMobile ? config.title.mobile : config.title.desktop,
      left: 'center',
      textStyle: {
        color: getCSSVariable('--text-primary'),
        fontSize: fontSize.title,
        fontWeight: 600,
      },
    },
    tooltip: {
      position: 'top',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any): string => {
        const data: (number | HeatmapDataPoint)[] = params.data;
        const dataPoint: HeatmapDataPoint = data[3] as HeatmapDataPoint;
        return `
          <div style="padding: 8px;">
            <strong>Hour: ${data[0]}:00</strong><br/>
            Severity: <span style="color: ${getSeverityColor(dataPoint.severity)}">${SEVERITY_LABELS[dataPoint.severity]}</span><br/>
            Count: ${data[2]}<br/>
            Click to view details
          </div>
        `;
      },
      backgroundColor: getCSSVariable('--bg-card'),
      borderColor: getCSSVariable('--border-primary'),
      borderWidth: 1,
      textStyle: {
        color: getCSSVariable('--text-primary'),
      },
    },
    grid: {
      left: config.grid[deviceType].left,
      right: config.grid[deviceType].right,
      top: config.grid[deviceType].top,
      bottom: config.grid[deviceType].bottom,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: HOURS_IN_DAY }, (_: unknown, i: number) => `${i}:00`),
      splitArea: {
        show: true,
      },
      axisLabel: {
        color: getCSSVariable('--text-secondary'),
        interval: config.xAxis[deviceType].interval,
        fontSize: fontSize.axis,
        rotate: config.xAxis[deviceType].rotate,
      },
      name: config.xAxis[deviceType].showName ? 'Hour of Day' : '',
      nameTextStyle: {
        color: getCSSVariable('--text-secondary'),
        fontSize: fontSize.axisName,
      },
    },
    yAxis: {
      type: 'category',
      data: SEVERITY_ORDER.map((s: AnomalySeverity) => SEVERITY_LABELS[s]),
      splitArea: {
        show: true,
      },
      axisLabel: {
        color: getCSSVariable('--text-secondary'),
        fontSize: fontSize.axis,
      },
      name: 'Severity',
      nameTextStyle: {
        color: getCSSVariable('--text-secondary'),
      },
    },
    visualMap: {
      min: 0,
      max: maxCount,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: config.visualMap.colors,
      },
      textStyle: {
        color: getCSSVariable('--text-secondary'),
      },
    },
    series: [
      {
        name: 'Anomalies',
        type: 'heatmap',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: heatmapData as any,
        label: {
          show: true,
          color: '#fff',
          fontWeight: 'bold',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: getCSSVariable('--border-primary'),
        },
      },
    ],
  };
}
