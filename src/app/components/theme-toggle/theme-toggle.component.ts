import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SunIcon, MoonIcon } from './theme-icons';
import { ThemeService } from '../../application/services/theme.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  readonly sunIcon: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(SunIcon);
  readonly moonIcon: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(MoonIcon);

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
