import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { TECH_GLOSSARY } from '../../core/data/tech-glossary';

@Component({
  selector: 'app-feature-pill',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-block">
      <!-- Pill -->
      <button
        (click)="toggle($event)"
        class="rounded-full px-2 py-1 text-xs border transition-all cursor-pointer select-none"
        [class.border-zinc-800]="isDark()"
        [class.border-zinc-200]="!isDark()"
        [class.text-zinc-500]="isDark() && !isOpen()"
        [class.text-zinc-400]="!isDark() && !isOpen()"
        [class.border-violet-500]="isOpen()"
        [class.text-violet-400]="isOpen() && isDark()"
        [class.text-violet-600]="isOpen() && !isDark()"
        [class.bg-zinc-900]="isDark() && !isOpen()"
        [class.bg-white]="!isDark() && !isOpen()"
        [class.bg-violet-950]="isOpen() && isDark()"
        [class.bg-violet-50]="isOpen() && !isDark()"
      >
        {{ label() }}
      </button>

      <!-- Tooltip -->
      @if (isOpen() && description()) {
        <div
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded-xl border p-3 shadow-xl text-xs leading-relaxed"
          [class.bg-zinc-900]="isDark()"
          [class.bg-white]="!isDark()"
          [class.border-zinc-700]="isDark()"
          [class.border-zinc-200]="!isDark()"
          [class.text-zinc-300]="isDark()"
          [class.text-zinc-700]="!isDark()"
          style="animation: fadeUp 0.15s ease both"
          tabindex="0"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <!-- Label -->
          <p
            class="font-semibold mb-1.5"
            [class.text-violet-400]="isDark()"
            [class.text-violet-600]="!isDark()"
          >
            {{ label() }}
          </p>
          <!-- Descrizione -->
          <p>{{ description() }}</p>
          <!-- Progress bar auto-close -->
          <div
            class="mt-2 h-0.5 rounded-full overflow-hidden"
            [class.bg-zinc-700]="isDark()"
            [class.bg-zinc-200]="!isDark()"
          >
            <div
              class="h-full rounded-full origin-left"
              [class.bg-violet-500]="isDark()"
              [class.bg-violet-400]="!isDark()"
              style="animation: shrinkWidth 6s linear both"
            ></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FeaturePill {
  label = input.required<string>();
  isDark = input.required<boolean>();

  isOpen = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  description = computed(() => TECH_GLOSSARY[this.label()] ?? null);

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.description()) return;

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isOpen.set(true);
    this.clearTimer();
    this.timer = setTimeout(() => this.close(), 6000);
  }

  close(): void {
    this.isOpen.set(false);
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.isOpen()) this.close();
  }
}
