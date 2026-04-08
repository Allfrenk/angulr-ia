import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme';
import { FeaturePill } from '../../shared/components/feature-pill';
import { GridBackground } from '../../shared/components/grid-background';
import { ThemeToggle } from '../../shared/components/theme-toggle';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [GridBackground, ThemeToggle, FeaturePill],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-grid-background [isDark]="isDark()">
      <main
        class="relative z-20 flex flex-col items-center justify-center min-h-screen gap-12 px-8 py-24 text-center cursor-default"
      >
        <!-- Badge row: pill + toggle icon -->
        <div
          class="flex items-center gap-4"
          style="animation: fadeUp 0.5s ease both; animation-delay: 0ms"
        >
          <span
            class="rounded-full px-2 py-1 border text-xs tracking-widest uppercase"
            [class.border-zinc-700]="isDark()"
            [class.border-zinc-300]="!isDark()"
            [class.text-zinc-400]="isDark()"
            [class.text-zinc-500]="!isDark()"
            [class.bg-zinc-900]="isDark()"
            [class.bg-white]="!isDark()"
          >
            Angular 21 · Zoneless · Signals · OnPush
          </span>
          <app-theme-toggle />
        </div>

        <!-- H1 -->
        <h1
          class="font-black leading-none tracking-tight mt-4"
          style="animation: fadeUp 0.5s ease both; animation-delay: 80ms"
        >
          <span class="block text-7xl md:text-9xl">CRM</span>
          <span
            class="block text-7xl md:text-9xl"
            [class.text-violet-400]="isDark()"
            [class.text-violet-600]="!isDark()"
          >
            Demo
          </span>
        </h1>

        <!-- Description -->
        <p
          class="max-w-lg px-4 text-base leading-relaxed"
          [class.text-zinc-400]="isDark()"
          [class.text-zinc-500]="!isDark()"
          style="animation: fadeUp 0.5s ease both; animation-delay: 160ms"
        >
          Un CRM reale costruito con le API più recenti di Angular 21: Zoneless Change Detection,
          SignalStore, Signal Forms sperimentali, &#64;defer per il lazy rendering e lazy routing
          con auth guard.
        </p>

        <!-- CTA Button -->
        <button
          (click)="goToLogin()"
          class="flex items-center gap-5 rounded-2xl border p-2 transition-all cursor-pointer hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10"
          [class.border-zinc-700]="isDark()"
          [class.border-zinc-300]="!isDark()"
          [class.bg-zinc-900]="isDark()"
          [class.bg-white]="!isDark()"
          style="animation: fadeUp 0.5s ease both; animation-delay: 240ms"
        >
          <div class="w-14 h-14 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
            <span class="text-white font-bold text-lg">C</span>
          </div>
          <span
            class="font-medium text-base pr-2"
            [class.text-white]="isDark()"
            [class.text-zinc-800]="!isDark()"
          >
            Prova la demo
          </span>
        </button>

        <!-- Feature pills -->
        <div
          class="flex flex-wrap justify-center gap-2 max-w-xl mt-2"
          style="animation: fadeUp 0.5s ease both; animation-delay: 320ms"
        >
          @for (f of features; track f) {
            <app-feature-pill [isDark]="isDark()" [label]="f" />
          }
        </div>
      </main>
    </app-grid-background>
  `,
})
export class Landing {
  private router = inject(Router);
  private themeService = inject(ThemeService);

  isDark = computed(() => this.themeService.isDark());

  features = [
    'Standalone',
    'Zoneless',
    'Signals',
    'Signal Store',
    '@defer',
    '@if / @for',
    'RxJS',
    'OnPush',
    'Signal Forms',
    'Lazy Routing',
  ];

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
