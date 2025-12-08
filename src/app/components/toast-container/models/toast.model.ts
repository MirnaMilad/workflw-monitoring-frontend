export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  timestamp: Date;
}

export const DEFAULT_TOAST_DURATION: number = 5000; // 5 seconds
