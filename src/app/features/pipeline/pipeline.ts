import { CurrencyPipe } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import {
  ChevronLeft,
  ChevronRight,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Plus,
  TrendingUp,
  X,
} from 'lucide-angular';
import { ThemeService } from '../../core/services/theme';
import { Deal, DealStage, PipelineStore, STAGES } from '../../core/store/pipeline.store';
import { FeaturePill } from '../../shared/components/feature-pill';
import { GridBackground } from '../../shared/components/grid-background';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [GridBackground, FeaturePill, LucideAngularModule, CurrencyPipe, FormField],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ ChevronRight, ChevronLeft, TrendingUp, Plus, X }),
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
              {{ pipelineStore.activeDeals().length }} deal attivi · trascina per navigare
            </p>
          </div>
          <div class="flex items-center gap-4 flex-wrap">
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
            <button
              (click)="openModal()"
              class="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              <lucide-icon name="plus" [size]="16" />
              Nuovo Deal
            </button>
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
              colonna del kanban legge dalla Map senza ricalcoli inutili. addDeal usa patchState per
              aggiungere immutabilmente il deal nello store. Il modal usa Signal Forms per i campi
              testo e signals separati per stage e probability. &#64;for con &#64;empty gestisce le
              colonne vuote dichiarativamente.
            </p>
          </div>
        } @placeholder {
          <ng-container></ng-container>
        } @loading {
          <ng-container></ng-container>
        }
      </div>

      <!-- MODAL NUOVO DEAL -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            class="absolute inset-0 bg-black/60"
            (click)="closeModal()"
            (keypress)="closeModal()"
            role="button"
            tabindex="0"
          ></div>
          <div
            class="relative z-10 w-full max-w-md rounded-2xl border p-8 space-y-4 max-h-[90vh] overflow-y-auto"
            [class.glass-dark]="isDark()"
            [class.glass-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <div class="flex items-center justify-between">
              <h2
                class="font-bold text-lg"
                [class.text-white]="isDark()"
                [class.text-zinc-900]="!isDark()"
              >
                Nuovo Deal
              </h2>
              <button
                (click)="closeModal()"
                class="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <lucide-icon name="x" [size]="20" [color]="isDark() ? '#71717a' : '#52525b'" />
              </button>
            </div>

            <div class="space-y-4">
              <!-- Cliente -->
              <div class="flex flex-col gap-1">
                <label
                  for="deal-client"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Cliente *</label
                >
                <input
                  id="deal-client"
                  type="text"
                  [formField]="newDealForm.clientName"
                  placeholder="Nome cliente"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                  [class.placeholder:text-zinc-600]="isDark()"
                  [class.placeholder:text-zinc-400]="!isDark()"
                />
                @if (newDealForm.clientName().touched() && newDealForm.clientName().invalid()) {
                  @for (err of newDealForm.clientName().errors(); track err.kind) {
                    <span class="text-xs text-red-400">{{ err.message }}</span>
                  }
                }
              </div>

              <!-- Azienda -->
              <div class="flex flex-col gap-1">
                <label
                  for="deal-company"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Azienda *</label
                >
                <input
                  id="deal-company"
                  type="text"
                  [formField]="newDealForm.company"
                  placeholder="Nome azienda"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                  [class.placeholder:text-zinc-600]="isDark()"
                  [class.placeholder:text-zinc-400]="!isDark()"
                />
                @if (newDealForm.company().touched() && newDealForm.company().invalid()) {
                  @for (err of newDealForm.company().errors(); track err.kind) {
                    <span class="text-xs text-red-400">{{ err.message }}</span>
                  }
                }
              </div>

              <!-- Note -->
              <div class="flex flex-col gap-1">
                <label
                  for="deal-notes"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Note</label
                >
                <input
                  id="deal-notes"
                  type="text"
                  [formField]="newDealForm.notes"
                  placeholder="Note sul deal (opzionale)"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                  [class.placeholder:text-zinc-600]="isDark()"
                  [class.placeholder:text-zinc-400]="!isDark()"
                />
              </div>

              <!-- Valore + Probabilità (2 col) -->
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1">
                  <label
                    for="deal-value"
                    class="text-xs font-medium uppercase tracking-wider"
                    [class.text-zinc-400]="isDark()"
                    [class.text-zinc-600]="!isDark()"
                    >Valore €</label
                  >
                  <input
                    id="deal-value"
                    type="number"
                    min="0"
                    [value]="newDealValue()"
                    (input)="newDealValue.set(+$any($event.target).value)"
                    placeholder="0"
                    class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                    [class.bg-zinc-800]="isDark()"
                    [class.bg-zinc-50]="!isDark()"
                    [class.border-zinc-700]="isDark()"
                    [class.border-zinc-300]="!isDark()"
                    [class.text-white]="isDark()"
                    [class.text-zinc-900]="!isDark()"
                    [class.placeholder:text-zinc-600]="isDark()"
                    [class.placeholder:text-zinc-400]="!isDark()"
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <label
                    for="deal-probability"
                    class="text-xs font-medium uppercase tracking-wider"
                    [class.text-zinc-400]="isDark()"
                    [class.text-zinc-600]="!isDark()"
                    >Prob. %</label
                  >
                  <input
                    id="deal-probability"
                    type="number"
                    min="0"
                    max="100"
                    [value]="newDealProbability()"
                    (input)="newDealProbability.set(+$any($event.target).value)"
                    placeholder="25"
                    class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                    [class.bg-zinc-800]="isDark()"
                    [class.bg-zinc-50]="!isDark()"
                    [class.border-zinc-700]="isDark()"
                    [class.border-zinc-300]="!isDark()"
                    [class.text-white]="isDark()"
                    [class.text-zinc-900]="!isDark()"
                    [class.placeholder:text-zinc-600]="isDark()"
                    [class.placeholder:text-zinc-400]="!isDark()"
                  />
                </div>
              </div>

              <!-- Stage -->
              <div class="flex flex-col gap-1">
                <label
                  for="deal-stage"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Stage</label
                >
                <select
                  id="deal-stage"
                  [value]="newDealStage()"
                  (change)="newDealStage.set($any($event.target).value)"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors appearance-none cursor-pointer"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                >
                  @for (s of stages; track s.key) {
                    <option [value]="s.key">{{ s.label }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                (click)="closeModal()"
                class="flex-1 rounded-xl py-3 text-sm font-semibold transition-colors cursor-pointer border"
                [class.border-zinc-700]="isDark()"
                [class.border-zinc-300]="!isDark()"
                [class.text-zinc-400]="isDark()"
                [class.text-zinc-700]="!isDark()"
                [class.hover:bg-zinc-800]="isDark()"
                [class.hover:bg-zinc-100]="!isDark()"
              >
                Annulla
              </button>
              <button
                (click)="submitDeal()"
                [disabled]="isSubmitting()"
                class="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                @if (isSubmitting()) {
                  Salvataggio...
                } @else {
                  Aggiungi Deal
                }
              </button>
            </div>
          </div>
        </div>
      }
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

  // — Modal nuovo deal —
  showModal = signal(false);
  isSubmitting = signal(false);
  newDealStage = signal<DealStage>('lead');
  newDealValue = signal(0);
  newDealProbability = signal(25);

  newDealModel = signal({ clientName: '', company: '', notes: '' });

  newDealForm = form(this.newDealModel, (path) => {
    required(path.clientName, { message: 'Nome cliente obbligatorio' });
    required(path.company, { message: 'Azienda obbligatoria' });
  });

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  submitDeal(): void {
    if (this.newDealForm.clientName().invalid() || this.newDealForm.company().invalid()) return;
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.pipelineStore.addDeal({
        clientName: this.newDealForm.clientName().value(),
        company: this.newDealForm.company().value(),
        notes: this.newDealForm.notes().value(),
        value: this.newDealValue(),
        probability: this.newDealProbability(),
        stage: this.newDealStage(),
        expectedClose: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
      this.isSubmitting.set(false);
      this.closeModal();
      this.newDealModel.set({ clientName: '', company: '', notes: '' });
      this.newDealValue.set(0);
      this.newDealProbability.set(25);
      this.newDealStage.set('lead');
    }, 500);
  }

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
    'addDeal()',
    'Signal Forms',
    'form()',
    '@for @empty',
    'viewChild()',
    'drag-to-scroll',
    'OnPush',
  ];
}
