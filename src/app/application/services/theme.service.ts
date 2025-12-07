import { Injectable, signal, effect, WritableSignal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY: string = 'workflow-monitoring-theme';
  private readonly darkMode: WritableSignal<boolean> = signal<boolean>(this.getInitialTheme());

  constructor() {
    // Apply theme when it changes
    effect(() => {
      this.applyTheme(this.darkMode());
    });
  }

  private getInitialTheme(): boolean {
    // Check localStorage first
    const savedTheme: string | null = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    const theme: Theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  isDarkMode(): boolean {
    return this.darkMode();
  }

  toggleTheme(): void {
    this.darkMode.update((current: boolean) => !current);
  }

  setTheme(theme: Theme): void {
    this.darkMode.set(theme === 'dark');
  }
}
