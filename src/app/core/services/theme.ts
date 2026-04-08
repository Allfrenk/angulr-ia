import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);

  private getInitialTheme(): Theme {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  theme = signal<Theme>(this.getInitialTheme());

  isDark = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      const t = this.theme();
      const html = this.document.documentElement;
      html.classList.remove('dark', 'light');
      html.classList.add(t);
      localStorage.setItem('theme', t);
    });
  }

  toggle() {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  setTheme(t: Theme) {
    this.theme.set(t);
  }
}
