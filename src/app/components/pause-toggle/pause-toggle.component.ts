import {
  Component,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pause-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pause-toggle.component.html',
  styleUrls: ['./pause-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PauseToggleComponent {
  readonly isPaused: WritableSignal<boolean> = signal<boolean>(false);
  readonly pauseStateChange: OutputEmitterRef<boolean> = output<boolean>();

  toggle(): void {
    this.isPaused.update((current: boolean) => !current);
    this.pauseStateChange.emit(this.isPaused());
  }
}
