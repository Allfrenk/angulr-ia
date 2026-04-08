import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SpotlightStore } from '../../core/store/spotlight.store';

@Component({
  selector: 'app-grid-background',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .spotlight-layer {
        position: absolute;
        inset: 0;
        z-index: 10;
        pointer-events: none;
        /* Animazione fluida di mezzo secondo per x e y */
        transition:
          --x 0.2s ease-out,
          --y 0.2s ease-out;
      }

      .dark-spot {
        background: radial-gradient(
          2200px circle at var(--x) var(--y),
          transparent 0%,
          rgba(9, 9, 11, 0.96) 55%
        );
      }

      .light-spot {
        background: radial-gradient(
          2200px circle at var(--x) var(--y),
          transparent 0%,
          rgba(250, 250, 250, 0.96) 55%
        );
      }
    `,
  ],
  template: `
    <div
      (mousemove)="!disableSpotlight() && store.onMouseMove($event)"
      (mouseleave)="!disableSpotlight() && store.onMouseLeave()"
      class="min-h-screen relative overflow-hidden transition-colors duration-500"
      [class.bg-zinc-950]="isDark()"
      [class.bg-zinc-50]="!isDark()"
      [class.text-white]="isDark()"
      [class.text-zinc-900]="!isDark()"
    >
      <svg class="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <defs>
          <pattern id="grid" width="55" height="55" patternUnits="userSpaceOnUse">
            <line
              [attr.stroke]="isDark() ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)'"
              x1="55"
              y1="0"
              x2="0"
              y2="0"
            />
            <line
              [attr.stroke]="isDark() ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)'"
              x1="0"
              y1="0"
              x2="0"
              y2="55"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      @if (!disableSpotlight()) {
        <div
          class="spotlight-layer"
          [ngClass]="isDark() ? 'dark-spot' : 'light-spot'"
          [style.--x.px]="store.x()"
          [style.--y.px]="store.y()"
        ></div>
      }

      <div class="relative z-20">
        <ng-content />
      </div>
    </div>
  `,
})
export class GridBackground {
  isDark = input.required<boolean>();
  disableSpotlight = input<boolean>(false);
  protected store = inject(SpotlightStore);
}
