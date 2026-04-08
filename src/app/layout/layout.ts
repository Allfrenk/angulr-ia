import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../core/services/theme';
import { Sidebar } from '../shared/components/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar />
      <main
        class="flex-1 overflow-y-auto no-scrollbar"
        [class.bg-zinc-950]="isDark()"
        [class.bg-zinc-100]="!isDark()"
      >
        <router-outlet />
      </main>
    </div>
  `,
})
export class Layout {
  private themeService = inject(ThemeService);
  isDark = computed(() => this.themeService.isDark());
}
