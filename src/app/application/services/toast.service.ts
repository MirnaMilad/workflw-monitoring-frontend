import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  Toast,
  ToastType,
  DEFAULT_TOAST_DURATION,
} from '../../components/toast-container/models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toasts: WritableSignal<Toast[]> = signal<Toast[]>([]);
  private toastCounter: number = 0;

  getToasts(): WritableSignal<Toast[]> {
    return this.toasts;
  }

  show(message: string, type: ToastType = 'info', duration: number = DEFAULT_TOAST_DURATION): void {
    const toast: Toast = {
      id: `toast-${++this.toastCounter}-${Date.now()}`,
      message,
      type,
      duration,
      timestamp: new Date(),
    };

    this.toasts.update((current: Toast[]) => [...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    this.toasts.update((current: Toast[]) => current.filter((toast: Toast) => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
