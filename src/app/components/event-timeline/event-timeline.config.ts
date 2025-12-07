export const RESPONSIVE_CONFIG: Record<
  'mobile' | 'tablet' | 'desktop',
  {
    grid: Record<string, string | number | boolean>;
    xAxisLabel: { rotate: number; fontSize: number };
  }
> = {
  mobile: {
    grid: {
      left: '8%',
      right: '8%',
      top: '8%',
      bottom: '18%',
      containLabel: true,
    },
    xAxisLabel: {
      rotate: 60,
      fontSize: 9,
    },
  },
  tablet: {
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '15%',
      containLabel: true,
    },
    xAxisLabel: {
      rotate: 45,
      fontSize: 10,
    },
  },
  desktop: {
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '15%',
      containLabel: true,
    },
    xAxisLabel: {
      rotate: 45,
      fontSize: 11,
    },
  },
};

export const CHART_DEFAULTS: {
  scatter: {
    symbolSize: number;
    borderWidth: number;
    emphasisScale: number;
    shadowBlur: number;
    shadowColor: string;
  };
  line: { width: number; type: 'dashed' };
} = {
  scatter: {
    symbolSize: 20,
    borderWidth: 2,
    emphasisScale: 1.5,
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  line: {
    width: 2,
    type: 'dashed' as const,
  },
};

export const AUTO_SCROLL_THRESHOLD: number = 10;

export function buildChartOption(
  xAxisData: string[],
  seriesData: { value: number }[],
  responsiveConfig: (typeof RESPONSIVE_CONFIG)['mobile'],
  getCSSVar: (variable: string) => string,
  formatTooltipFn: (data: unknown) => string,
): {
  backgroundColor: string;
  tooltip: {
    trigger: string;
    formatter: (params: unknown) => string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    textStyle: { color: string };
  };
  grid: Record<string, string | number | boolean>;
  xAxis: {
    type: string;
    data: string[];
    axisLabel: { color: string; rotate: number; fontSize: number };
    axisLine: { lineStyle: { color: string } };
    splitLine: { show: boolean; lineStyle: { color: string } };
  };
  yAxis: { type: string; show: boolean };
  series: {
    type: string;
    data: { value: number }[] | number[];
    symbolSize?: number;
    itemStyle?: { borderWidth: number; borderColor: string };
    emphasis?: { scale: number; itemStyle: { shadowBlur: number; shadowColor: string } };
    lineStyle?: { color: string; width: number; type: string };
    symbol?: string;
    smooth?: boolean;
  }[];
} {
  return {
    backgroundColor: getCSSVar('--bg-card'),
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown): string => {
        if (Array.isArray(params)) return '';
        if (!params || typeof params !== 'object' || !('data' in params)) return '';
        return formatTooltipFn((params as { data: unknown }).data);
      },
      backgroundColor: getCSSVar('--bg-card'),
      borderColor: getCSSVar('--border-primary'),
      borderWidth: 1,
      textStyle: {
        color: getCSSVar('--text-primary'),
      },
    },
    grid: responsiveConfig.grid,
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        color: getCSSVar('--text-secondary'),
        ...responsiveConfig.xAxisLabel,
      },
      axisLine: {
        lineStyle: {
          color: getCSSVar('--border-primary'),
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: getCSSVar('--chart-grid'),
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
        symbolSize: CHART_DEFAULTS.scatter.symbolSize,
        itemStyle: {
          borderWidth: CHART_DEFAULTS.scatter.borderWidth,
          borderColor: getCSSVar('--bg-card'),
        },
        emphasis: {
          scale: CHART_DEFAULTS.scatter.emphasisScale,
          itemStyle: {
            shadowBlur: CHART_DEFAULTS.scatter.shadowBlur,
            shadowColor: CHART_DEFAULTS.scatter.shadowColor,
          },
        },
      },
      {
        type: 'line',
        data: seriesData.map((d: { value: number }) => d.value),
        lineStyle: {
          color: getCSSVar('--chart-grid'),
          width: CHART_DEFAULTS.line.width,
          type: CHART_DEFAULTS.line.type,
        },
        symbol: 'none',
        smooth: true,
      },
    ],
  };
}
