export function getCSSVariable(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

export function getMaxCount(dataPoints: { count: number }[]): number {
  return Math.max(...dataPoints.map((p: { count: number }) => p.count), 1);
}

export function getDeviceType(containerWidth: number): {
  isMobile: boolean;
  isTablet: boolean;
} {
  const isMobile: boolean = containerWidth < 768;
  const isTablet: boolean = containerWidth >= 768 && containerWidth < 1024;
  return { isMobile, isTablet };
}
