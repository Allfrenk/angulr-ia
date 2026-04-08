import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-feature-pill',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="rounded-full px-2 py-1 text-xs border"
      [class.border-zinc-800]="isDark()"
      [class.text-zinc-500]="isDark()"
      [class.bg-zinc-900]="isDark()"
      [class.border-zinc-200]="!isDark()"
      [class.text-zinc-400]="!isDark()"
      [class.bg-white]="!isDark()"
    >
      {{ label() }}
    </span>
  `,
})
export class FeaturePill {
  label = input.required<string>();
  isDark = input.required<boolean>();
}
