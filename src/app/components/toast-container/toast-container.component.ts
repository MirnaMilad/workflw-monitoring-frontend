import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../application/services/toast.service';
import { Toast } from './models/toast.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  private readonly toastService: ToastService = inject(ToastService);
  readonly toasts: Signal<Toast[]> = this.toastService.getToasts();

  onClose(id: string): void {
    this.toastService.remove(id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }
}
