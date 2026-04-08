import { CurrencyPipe } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import {
  ChevronLeft,
  ChevronRight,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  TrendingUp,
} from 'lucide-angular';
import { ThemeService } from '../../core/services/theme';
import { Deal, DealStage, PipelineStore, STAGES } from '../../core/store/pipeline.store';
import { FeaturePill } from '../../shared/components/feature-pill';
import { GridBackground } from '../../shared/components/grid-background';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [GridBackground, FeaturePill, LucideAngularModule, CurrencyPipe],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ ChevronRight, ChevronLeft, TrendingUp }),
    },
  ],
  template: `
    <app-grid-background [isDark]="isDark()" [disableSpotlight]="true">
      <div class="p-8 space-y-6">
        <!-- HEADER con KPI -->
        <div class="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1
              class="text-2xl font-bold"
              [class.text-white]="isDark()"
              [class.text-zinc-900]="!isDark()"
            >
              Pipeline
            </h1>
            <p
              class="text-sm mt-1"
              [class.text-zinc-400]="isDark()"
              [class.text-zinc-600]="!isDark()"
            >
              Gestisci i tuoi deal
            </p>
          </div>
          <div class="flex gap-4 flex-wrap">
            <div
              class="rounded-xl border px-5 py-3"
              [class.glass-card-dark]="isDark()"
              [class.glass-card-light]="!isDark()"
              [class.border-zinc-800]="isDark()"
              [class.border-zinc-300]="!isDark()"
            >
              <p
                class="text-xs uppercase tracking-wider"
                [class.text-zinc-500]="isDark()"
                [class.text-zinc-600]="!isDark()"
              >
                Totale Pipeline
              </p>
              <p class="text-xl font-bold text-violet-400">
                {{
                  pipelineStore.totalPipelineValue() | currency: 'EUR' : 'symbol' : '1.0-0' : 'it'
                }}
              </p>
            </div>
            <div
              class="rounded-xl border px-5 py-3"
              [class.glass-card-dark]="isDark()"
              [class.glass-card-light]="!isDark()"
              [class.border-zinc-800]="isDark()"
              [class.border-zinc-300]="!isDark()"
            >
              <p
                class="text-xs uppercase tracking-wider"
                [class.text-zinc-500]="isDark()"
                [class.text-zinc-600]="!isDark()"
              >
                Valore Pesato
              </p>
              <p class="text-xl font-bold text-green-400">
                {{ pipelineStore.weightedValue() | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
              </p>
            </div>
            <div
              class="rounded-xl border px-5 py-3"
              [class.glass-card-dark]="isDark()"
              [class.glass-card-light]="!isDark()"
              [class.border-zinc-800]="isDark()"
              [class.border-zinc-300]="!isDark()"
            >
              <p
                class="text-xs uppercase tracking-wider"
                [class.text-zinc-500]="isDark()"
                [class.text-zinc-600]="!isDark()"
              >
                Deal Vinti
              </p>
              <p class="text-xl font-bold text-amber-400">
                {{ pipelineStore.wonValue() | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
              </p>
            </div>
          </div>
        </div>

        <!-- KANBAN BOARD -->
        <div
          #kanbanBoard
          class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
          (mousedown)="startDrag($event)"
          (mousemove)="onDrag($event)"
          (mouseup)="endDrag()"
          (mouseleave)="endDrag()"
          (keydown)="onKeyDown($event)"
          tabindex="0"
        >
          @for (stage of stages; track stage.key) {
            <div class="shrink-0 w-72 flex flex-col gap-3">
              <!-- Stage Header -->
              <div
                class="rounded-xl border px-4 py-3 flex items-center justify-between"
                [class.glass-card-dark]="isDark()"
                [class.glass-card-light]="!isDark()"
                [class.border-zinc-800]="isDark()"
                [class.border-zinc-300]="!isDark()"
              >
                <div>
                  <span
                    class="text-xs font-semibold uppercase tracking-wider"
                    [class]="isDark() ? stage.darkTextClass : stage.lightTextClass"
                  >
                    {{ stage.label }}
                  </span>
                  <p
                    class="text-xs mt-0.5"
                    [class.text-zinc-500]="isDark()"
                    [class.text-zinc-600]="!isDark()"
                  >
                    {{ getDealsForStage(stage.key).length }} deal
                    @if (getStageTotal(stage.key) > 0) {
                      · {{ getStageTotal(stage.key) | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
                    }
                  </p>
                </div>
                <div
                  class="w-2 h-2 rounded-full"
                  [class]="isDark() ? stage.darkColorClass : stage.lightColorClass"
                ></div>
              </div>

              <!-- Deal Cards -->
              @for (deal of getDealsForStage(stage.key); track deal.id) {
                <div
                  class="rounded-xl border p-4 space-y-3 transition-all hover:border-violet-500/50 cursor-default"
                  [class.glass-card-dark]="isDark()"
                  [class.glass-card-light]="!isDark()"
                  [class.border-zinc-800]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                >
                  <div>
                    <p
                      class="text-sm font-semibold"
                      [class.text-white]="isDark()"
                      [class.text-zinc-900]="!isDark()"
                    >
                      {{ deal.clientName }}
                    </p>
                    <p
                      class="text-xs"
                      [class.text-zinc-400]="isDark()"
                      [class.text-zinc-600]="!isDark()"
                    >
                      {{ deal.company }}
                    </p>
                  </div>

                  <p class="text-base font-bold text-violet-400">
                    {{ deal.value | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
                  </p>

                  <div>
                    <div class="flex justify-between mb-1">
                      <span
                        class="text-xs"
                        [class.text-zinc-500]="isDark()"
                        [class.text-zinc-600]="!isDark()"
                        >Probabilità</span
                      >
                      <span
                        class="text-xs font-medium"
                        [class.text-white]="isDark()"
                        [class.text-zinc-900]="!isDark()"
                        >{{ deal.probability }}%</span
                      >
                    </div>
                    <div
                      class="h-1.5 rounded-full w-full"
                      [class.bg-zinc-800]="isDark()"
                      [class.bg-zinc-200]="!isDark()"
                    >
                      <div
                        class="h-1.5 rounded-full transition-all {{
                          getProbabilityColor(deal.probability)
                        }}"
                        [style.width.%]="deal.probability"
                      ></div>
                    </div>
                  </div>

                  @if (deal.notes) {
                    <p
                      class="text-xs leading-relaxed"
                      [class.text-zinc-500]="isDark()"
                      [class.text-zinc-600]="!isDark()"
                    >
                      {{ deal.notes }}
                    </p>
                  }

                  <div class="flex gap-2 pt-1">
                    @if (canMoveBack(deal.stage)) {
                      <button
                        (click)="moveBack(deal)"
                        (mousedown)="$event.stopPropagation()"
                        class="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs transition-all cursor-pointer border"
                        [class.border-zinc-700]="isDark()"
                        [class.border-zinc-300]="!isDark()"
                        [class.text-zinc-400]="isDark()"
                        [class.text-zinc-600]="!isDark()"
                        [class.hover:bg-zinc-800]="isDark()"
                        [class.hover:bg-zinc-100]="!isDark()"
                      >
                        <lucide-icon name="chevron-left" [size]="12" /> Indietro
                      </button>
                    }
                    @if (canMoveForward(deal.stage)) {
                      <button
                        (click)="moveForward(deal)"
                        (mousedown)="$event.stopPropagation()"
                        class="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer"
                      >
                        Avanza <lucide-icon name="chevron-right" [size]="12" />
                      </button>
                    }
                  </div>
                </div>
              } @empty {
                <div
                  class="rounded-xl border border-dashed p-6 text-center"
                  [class.border-zinc-800]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                >
                  <p
                    class="text-xs"
                    [class.text-zinc-600]="isDark()"
                    [class.text-zinc-500]="!isDark()"
                  >
                    Nessun deal
                  </p>
                </div>
              }
            </div>
          }
        </div>

        <!-- PATTERN USATI — @defer on timer -->
        @defer (on timer(500ms)) {
          <div
            class="rounded-2xl border p-6"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
            style="animation: fadeIn 0.4s ease both"
          >
            <p
              class="text-xs uppercase tracking-wider font-medium mb-3"
              [class.text-zinc-500]="isDark()"
              [class.text-zinc-600]="!isDark()"
            >
              Pattern Angular 21 usati in questa pagina
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              @for (p of patterns; track p) {
                <app-feature-pill [isDark]="isDark()" [label]="p" />
              }
            </div>
            <p
              class="text-xs leading-relaxed"
              [class.text-zinc-500]="isDark()"
              [class.text-zinc-700]="!isDark()"
            >
              dealsByStage è un computed signal che genera una Map&lt;DealStage, Deal[]&gt; — ogni
              colonna del kanban legge dalla Map senza ricalcoli inutili. moveToStage usa patchState
              per aggiornare immutabilmente il deal nello store. &#64;for con &#64;empty gestisce le
              colonne vuote dichiarativamente. Il movimento tra stage è reattivo: basta modificare
              il signal e il kanban si aggiorna automaticamente.
            </p>
          </div>
        } @placeholder {
          <ng-container></ng-container>
        } @loading {
          <ng-container></ng-container>
        }
      </div>
    </app-grid-background>
  `,
})
export class Pipeline {
  private themeService = inject(ThemeService);
  protected pipelineStore = inject(PipelineStore);

  isDark = computed(() => this.themeService.isDark());

  stages = STAGES;

  kanbanBoard = viewChild<ElementRef>('kanbanBoard');

  private isDragging = signal(false);
  private startX = signal(0);
  private scrollLeft = signal(0);

  startDrag(event: MouseEvent): void {
    const board = this.kanbanBoard()?.nativeElement;
    if (!board) return;
    this.isDragging.set(true);
    this.startX.set(event.pageX - board.offsetLeft);
    this.scrollLeft.set(board.scrollLeft);
  }

  onDrag(event: MouseEvent): void {
    if (!this.isDragging()) return;
    event.preventDefault();
    const board = this.kanbanBoard()?.nativeElement;
    if (!board) return;
    const x = event.pageX - board.offsetLeft;
    const walk = (x - this.startX()) * 1.5;
    board.scrollLeft = this.scrollLeft() - walk;
  }

  endDrag(): void {
    this.isDragging.set(false);
  }

  onKeyDown(event: KeyboardEvent): void {
    const board = this.kanbanBoard()?.nativeElement;
    if (!board) return;
    if (event.key === 'ArrowRight') {
      board.scrollLeft += 300;
      event.preventDefault();
    }
    if (event.key === 'ArrowLeft') {
      board.scrollLeft -= 300;
      event.preventDefault();
    }
  }

  getDealsForStage(stageKey: DealStage): Deal[] {
    return this.pipelineStore.dealsByStage().get(stageKey) ?? [];
  }

  getStageTotal(stageKey: DealStage): number {
    return this.getDealsForStage(stageKey).reduce((s, d) => s + d.value, 0);
  }

  canMoveForward(stage: DealStage): boolean {
    const keys = STAGES.map((s) => s.key);
    const idx = keys.indexOf(stage);
    return idx < keys.length - 1;
  }

  canMoveBack(stage: DealStage): boolean {
    const keys = STAGES.map((s) => s.key);
    const idx = keys.indexOf(stage);
    return idx > 0;
  }

  moveForward(deal: Deal): void {
    const keys = STAGES.map((s) => s.key);
    const idx = keys.indexOf(deal.stage);
    if (idx < keys.length - 1) {
      this.pipelineStore.moveToStage(deal.id, keys[idx + 1]);
    }
  }

  moveBack(deal: Deal): void {
    const keys = STAGES.map((s) => s.key);
    const idx = keys.indexOf(deal.stage);
    if (idx > 0) {
      this.pipelineStore.moveToStage(deal.id, keys[idx - 1]);
    }
  }

  getProbabilityColor(p: number): string {
    if (p >= 75) return 'bg-green-500';
    if (p >= 50) return 'bg-amber-500';
    if (p >= 25) return 'bg-blue-500';
    return 'bg-zinc-600';
  }

  patterns = [
    'SignalStore',
    'dealsByStage Map',
    'withComputed()',
    'patchState()',
    'withMethods()',
    'moveToStage()',
    '@for @empty',
    'viewChild()',
    'drag-to-scroll',
    'OnPush',
  ];
}
