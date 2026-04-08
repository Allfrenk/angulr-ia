import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, Moon, Sun } from 'lucide-angular';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideAngularModule],
  providers: [
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Sun, Moon }) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="toggle()"
      class="cursor-pointer hover:opacity-70 transition-opacity leading-none flex items-center justify-center"
    >
      @if (isDark()) {
        <lucide-icon name="sun" [color]="'#a78bfa'" [size]="28" />
      } @else {
        <lucide-icon name="moon" [color]="'#7c3aed'" [size]="28" />
      }
    </button>
  `,
})
export class ThemeToggle {
  private themeService = inject(ThemeService);

  isDark = computed(() => this.themeService.isDark());

  toggle(): void {
    this.themeService.toggle();
  }
}
