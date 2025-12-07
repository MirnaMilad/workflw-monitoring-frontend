import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefreshConfig, REFRESH_INTERVALS, DEFAULT_REFRESH_CONFIG } from './refresh-config.model';
import { REFRESH_ICON, CHEVRON_DOWN_ICON } from './refresh-icons';
import { SafeHtmlPipe } from './safe-html.pipe';

@Component({
  selector: 'app-refresh-control',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './refresh-control.component.html',
  styleUrls: ['./refresh-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefreshControlComponent {
  @Output() configChange: EventEmitter<RefreshConfig> = new EventEmitter<RefreshConfig>();
  @Output() manualRefresh: EventEmitter<void> = new EventEmitter<void>();

  readonly config: WritableSignal<RefreshConfig> = signal<RefreshConfig>(DEFAULT_REFRESH_CONFIG);
  readonly intervals: { label: string; value: number }[] = REFRESH_INTERVALS;
  readonly showIntervalMenu: WritableSignal<boolean> = signal<boolean>(false);
  readonly refreshIcon: string = REFRESH_ICON;
  readonly chevronDownIcon: string = CHEVRON_DOWN_ICON;

  constructor() {
    // Emit config changes
    effect(() => {
      const currentConfig: RefreshConfig = this.config();
      this.configChange.emit(currentConfig);
    });
  }

  toggleAutoRefresh(): void {
    this.config.update((current: RefreshConfig) => ({
      ...current,
      autoRefresh: !current.autoRefresh,
    }));
  }

  setInterval(intervalSeconds: number): void {
    this.config.update((current: RefreshConfig) => ({
      ...current,
      interval: intervalSeconds,
    }));
    this.showIntervalMenu.set(false);
  }

  toggleIntervalMenu(): void {
    this.showIntervalMenu.update((show: boolean) => !show);
  }

  onManualRefresh(): void {
    this.manualRefresh.emit();
  }
}
