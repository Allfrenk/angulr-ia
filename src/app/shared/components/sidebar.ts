import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  Kanban,
  LayoutDashboard,
  LogOut,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Users,
} from 'lucide-angular';
import { ThemeService } from '../../core/services/theme';
import { AuthStore } from '../../core/store/auth.store';
import { NavStore } from '../../core/store/nav.store';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, ThemeToggle],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ LayoutDashboard, Users, Kanban, LogOut }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="w-60 shrink-0 flex flex-col h-screen border-r bg-zinc-900 text-white"
      [class.bg-zinc-900]="isDark()"
      [class.bg-zinc-50]="!isDark()"
      [class.text-white]="isDark()"
      [class.text-zinc-900]="!isDark()"
      [class.border-zinc-800]="isDark()"
      [class.border-zinc-300]="!isDark()"
    >
      <!-- Header -->
      <div
        class="flex items-center gap-3 px-5 py-5 border-b"
        [class.border-zinc-800]="isDark()"
        [class.border-zinc-300]="!isDark()"
      >
        <div class="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
          <span class="text-white font-bold text-sm">C</span>
        </div>
        <div>
          <div
            class="font-semibold text-sm leading-tight"
            [class.text-white]="isDark()"
            [class.text-zinc-900]="!isDark()"
          >
            CRM Demo
          </div>
          <div
            class="text-xs leading-tight"
            [class.text-zinc-500]="isDark()"
            [class.text-zinc-600]="!isDark()"
          >
            Angular 21
          </div>
        </div>
      </div>

      <!-- Nav items -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        @for (item of navItems(); track item.route; let i = $index) {
          <a
            [routerLink]="item.route"
            routerLinkActive="route-active"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            [class.text-zinc-400]="isDark()"
            [class.text-zinc-600]="!isDark()"
            [class.hover:bg-zinc-800]="isDark()"
            [class.hover:bg-zinc-100]="!isDark()"
            [style]="'animation: slideInRight 0.35s ease both; animation-delay: ' + i * 60 + 'ms'"
          >
            <lucide-icon [name]="item.icon" [size]="18" class="shrink-0" />
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Footer -->
      <div
        class="px-4 py-4 border-t flex items-center justify-between"
        [class.border-zinc-800]="isDark()"
        [class.border-zinc-300]="!isDark()"
      >
        <app-theme-toggle />
        <button
          (click)="logout()"
          class="cursor-pointer hover:opacity-70 transition-opacity"
          title="Esci dalla demo"
        >
          <lucide-icon name="log-out" [size]="18" [color]="isDark() ? '#71717a' : '#52525b'" />
        </button>
      </div>
    </aside>
  `,
})
export class Sidebar {
  private themeService = inject(ThemeService);
  private navStore = inject(NavStore);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  isDark = computed(() => this.themeService.isDark());
  navItems = this.navStore.items;

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/']);
  }
}
