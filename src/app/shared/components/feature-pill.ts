import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  createComponent,
  EnvironmentInjector,
  HostListener,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { TECH_GLOSSARY } from '../../core/data/tech-glossary';

@Component({
  selector: 'app-tooltip-portal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed pointer-events-none"
      style="z-index: 99999;"
      [style.left.px]="x()"
      [style.top.px]="y()"
      [style.transform]="'translate(-50%, -100%)'"
    >
      <div
        class="w-64 rounded-xl border p-3 shadow-2xl text-xs leading-relaxed pointer-events-auto"
        style="animation: fadeUp 0.15s ease both; margin-bottom: 8px;"
        [class.bg-zinc-900]="isDark()"
        [class.bg-white]="!isDark()"
        [class.border-zinc-700]="isDark()"
        [class.border-zinc-200]="!isDark()"
        [class.text-zinc-300]="isDark()"
        [class.text-zinc-700]="!isDark()"
        tabindex="0"
        (click)="$event.stopPropagation()"
        (keydown)="$event.stopPropagation()"
      >
        <p
          class="font-semibold mb-1.5"
          [class.text-violet-400]="isDark()"
          [class.text-violet-600]="!isDark()"
        >
          {{ label() }}
        </p>
        <p>{{ description() }}</p>
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
    </div>
  `,
})
export class TooltipPortal {
  x = signal(0);
  y = signal(0);
  label = signal('');
  description = signal('');
  isDark = signal(false);
}

@Component({
  selector: 'app-feature-pill',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="toggle($event)"
      class="rounded-full px-2 py-1 text-xs border transition-all cursor-pointer select-none"
      [class.border-zinc-800]="isDark() && !isOpen()"
      [class.border-zinc-200]="!isDark() && !isOpen()"
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
  `,
})
export class FeaturePill implements OnDestroy {
  label = input.required<string>();
  isDark = input.required<boolean>();

  isOpen = signal(false);
  description = computed(() => TECH_GLOSSARY[this.label()] ?? null);

  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private tooltipRef: ComponentRef<TooltipPortal> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.description()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(event);
    }
  }

  open(event: MouseEvent): void {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();

    this.tooltipRef = createComponent(TooltipPortal, {
      environmentInjector: this.injector,
    });

    this.tooltipRef.instance.x.set(rect.left + rect.width / 2);
    this.tooltipRef.instance.y.set(rect.top - 8);
    this.tooltipRef.instance.label.set(this.label());
    this.tooltipRef.instance.description.set(this.description()!);
    this.tooltipRef.instance.isDark.set(this.isDark());

    this.appRef.attachView(this.tooltipRef.hostView);
    document.body.appendChild(this.tooltipRef.location.nativeElement);

    this.isOpen.set(true);
    this.clearTimer();
    this.timer = setTimeout(() => this.close(), 6000);
  }

  close(): void {
    this.isOpen.set(false);
    this.destroyTooltip();
    this.clearTimer();
  }

  private destroyTooltip(): void {
    if (this.tooltipRef) {
      this.appRef.detachView(this.tooltipRef.hostView);
      this.tooltipRef.destroy();
      this.tooltipRef = null;
    }
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

  ngOnDestroy(): void {
    this.close();
  }
}
