import type { EChartsOption } from 'echarts';
import { VolumeChartDataPoint } from './utils/volume-chart.utils';

export interface VolumeChartConfig {
  title: {
    mobile: string;
    desktop: string;
  };
  fontSize: {
    mobile: {
      title: number;
      axis: number;
      legend: number;
    };
    tablet: {
      title: number;
      axis: number;
      legend: number;
    };
    desktop: {
      title: number;
      axis: number;
      legend: number;
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
  colors: {
    bar: string;
    line: string;
    areaGradient: {
      start: string;
      end: string;
    };
  };
}

export const VOLUME_CHART_CONFIG: VolumeChartConfig = {
  title: {
    mobile: 'Workflow Volume',
    desktop: 'Workflow Volume Over Time',
  },
  fontSize: {
    mobile: {
      title: 14,
      axis: 10,
      legend: 10,
    },
    tablet: {
      title: 16,
      axis: 11,
      legend: 11,
    },
    desktop: {
      title: 18,
      axis: 12,
      legend: 12,
    },
  },
  grid: {
    mobile: {
      left: '10%',
      right: '8%',
      top: '20%',
      bottom: '15%',
    },
    desktop: {
      left: '8%',
      right: '5%',
      top: '15%',
      bottom: '12%',
    },
  },
  colors: {
    bar: '#3b82f6',
    line: '#8b5cf6',
    areaGradient: {
      start: 'rgba(139, 92, 246, 0.3)',
      end: 'rgba(139, 92, 246, 0.05)',
    },
  },
};

export function getVolumeChartOption(
  dataPoints: VolumeChartDataPoint[],
  isMobile: boolean,
  isTablet: boolean,
  getCSSVariable: (variable: string) => string,
): EChartsOption {
  const config: VolumeChartConfig = VOLUME_CHART_CONFIG;
  const deviceType: 'mobile' | 'desktop' = isMobile ? 'mobile' : 'desktop';
  const fontSize: VolumeChartConfig['fontSize']['mobile'] = isMobile
    ? config.fontSize.mobile
    : isTablet
      ? config.fontSize.tablet
      : config.fontSize.desktop;

  const hours: string[] = dataPoints.map((d: VolumeChartDataPoint) => d.hour);
  const counts: number[] = dataPoints.map((d: VolumeChartDataPoint) => d.count);

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
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: getCSSVariable('--text-secondary'),
        },
      },
      backgroundColor: getCSSVariable('--bg-card'),
      borderColor: getCSSVariable('--border-primary'),
      borderWidth: 1,
      textStyle: {
        color: getCSSVariable('--text-primary'),
        fontSize: fontSize.axis,
      },
    },
    legend: {
      data: ['Volume (Bar)', 'Trend (Line)'],
      top: isMobile ? '8%' : '10%',
      textStyle: {
        color: getCSSVariable('--text-secondary'),
        fontSize: fontSize.legend,
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
      data: hours,
      axisLabel: {
        color: getCSSVariable('--text-secondary'),
        fontSize: fontSize.axis,
        rotate: isMobile ? 45 : 0,
      },
      axisLine: {
        lineStyle: {
          color: getCSSVariable('--border-primary'),
        },
      },
      name: isMobile ? '' : 'Time',
      nameTextStyle: {
        color: getCSSVariable('--text-secondary'),
        fontSize: fontSize.axis,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Count',
        position: 'left',
        axisLabel: {
          color: getCSSVariable('--text-secondary'),
          fontSize: fontSize.axis,
        },
        axisLine: {
          lineStyle: {
            color: getCSSVariable('--border-primary'),
          },
        },
        splitLine: {
          lineStyle: {
            color: getCSSVariable('--chart-grid'),
            type: 'dashed',
          },
        },
        nameTextStyle: {
          color: getCSSVariable('--text-secondary'),
          fontSize: fontSize.axis,
        },
      },
    ],
    series: [
      {
        name: 'Volume (Bar)',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: config.colors.bar,
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: config.colors.bar,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
      {
        name: 'Trend (Line)',
        type: 'line',
        data: counts,
        smooth: true,
        lineStyle: {
          width: 2,
          color: config.colors.line,
        },
        itemStyle: {
          color: config.colors.line,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: config.colors.areaGradient.start,
              },
              {
                offset: 1,
                color: config.colors.areaGradient.end,
              },
            ],
          },
        },
      },
    ],
  };
}
