import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme';
import { ClientsStore } from '../../core/store/clients.store';
import { PipelineStore } from '../../core/store/pipeline.store';
import { FeaturePill } from '../../shared/components/feature-pill';
import { GridBackground } from '../../shared/components/grid-background';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GridBackground, FeaturePill, CurrencyPipe],
  template: `
    <app-grid-background [isDark]="isDark()" [disableSpotlight]="true">
      <div class="p-8 max-w-7xl mx-auto space-y-8">
        <!-- PAGE HEADER -->
        <div>
          <h1
            class="text-2xl font-bold"
            [class.text-white]="isDark()"
            [class.text-zinc-900]="!isDark()"
          >
            Dashboard
          </h1>
          <p
            class="text-sm mt-1"
            [class.text-zinc-400]="isDark()"
            [class.text-zinc-600]="!isDark()"
          >
            Panoramica del tuo CRM
          </p>
        </div>

        <!-- KPI GRID -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="rounded-2xl border p-6 flex flex-col gap-2"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <span
              class="text-xs uppercase tracking-wider"
              [class.text-zinc-500]="isDark()"
              [class.text-zinc-600]="!isDark()"
              >Totale Clienti</span
            >
            <span
              class="text-3xl font-bold"
              [class.text-white]="isDark()"
              [class.text-zinc-900]="!isDark()"
            >
              {{ totalClients() }}
            </span>
          </div>
          <div
            class="rounded-2xl border p-6 flex flex-col gap-2"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <span
              class="text-xs uppercase tracking-wider"
              [class.text-zinc-500]="isDark()"
              [class.text-zinc-600]="!isDark()"
              >Clienti Attivi</span
            >
            <span class="text-3xl font-bold text-green-400">{{ activeClients() }}</span>
          </div>
          <div
            class="rounded-2xl border p-6 flex flex-col gap-2"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <span
              class="text-xs uppercase tracking-wider"
              [class.text-zinc-500]="isDark()"
              [class.text-zinc-600]="!isDark()"
              >Valore Pipeline</span
            >
            <span class="text-3xl font-bold text-violet-400">
              {{ totalPipelineValue() | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
            </span>
          </div>
          <div
            class="rounded-2xl border p-6 flex flex-col gap-2"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <span
              class="text-xs uppercase tracking-wider"
              [class.text-zinc-500]="isDark()"
              [class.text-zinc-600]="!isDark()"
              >Valore Pesato</span
            >
            <span class="text-3xl font-bold text-amber-400">
              {{ weightedValue() | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
            </span>
          </div>
        </div>

        <!-- TWO COLUMN LAYOUT -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Clienti Recenti — render diretto -->
          <div
            class="rounded-2xl border p-6"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <h2
              class="font-semibold mb-4 text-sm uppercase tracking-wider"
              [class.text-zinc-400]="isDark()"
              [class.text-zinc-600]="!isDark()"
            >
              Clienti Recenti
            </h2>
            <div class="space-y-3">
              @for (client of recentClients(); track client.id) {
                <div
                  class="flex items-center justify-between py-2 border-b last:border-0"
                  [class.border-zinc-800]="isDark()"
                  [class.border-zinc-200]="!isDark()"
                >
                  <div>
                    <p
                      class="text-sm font-medium"
                      [class.text-white]="isDark()"
                      [class.text-zinc-900]="!isDark()"
                    >
                      {{ client.name }}
                    </p>
                    <p
                      class="text-xs"
                      [class.text-zinc-400]="isDark()"
                      [class.text-zinc-600]="!isDark()"
                    >
                      {{ client.company }}
                    </p>
                  </div>
                  <span
                    class="rounded-full px-2 py-0.5 text-xs border"
                    [class]="getStatusBadgeClass(client.status)"
                  >
                    {{ getStatusLabel(client.status) }}
                  </span>
                </div>
              }
            </div>
          </div>

          <!-- Deal Attivi — render diretto -->
          <div
            class="rounded-2xl border p-6"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <h2
              class="font-semibold mb-4 text-sm uppercase tracking-wider"
              [class.text-zinc-400]="isDark()"
              [class.text-zinc-600]="!isDark()"
            >
              Deal Attivi
            </h2>
            <div class="space-y-3">
              @for (deal of activeDeals(); track deal.id) {
                <div
                  class="flex items-center justify-between py-2 border-b last:border-0"
                  [class.border-zinc-800]="isDark()"
                  [class.border-zinc-200]="!isDark()"
                >
                  <div>
                    <p
                      class="text-sm font-medium"
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
                  <span class="text-sm font-semibold text-violet-400">
                    {{ deal.value | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
                  </span>
                </div>
              } @empty {
                <p
                  class="text-sm"
                  [class.text-zinc-500]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  Nessun deal attivo
                </p>
              }
            </div>
          </div>
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
              I KPI sono computed signals derivati da ClientsStore e PipelineStore — si aggiornano
              automaticamente quando lo stato cambia. I clienti recenti e i deal attivi sono render
              diretti: dati sincroni dallo store, zero lazy loading. Il blocco pattern usa
              &#64;defer on viewport: caricato solo quando scendi in fondo alla pagina.
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
export class Dashboard {
  private themeService = inject(ThemeService);
  private clientsStore = inject(ClientsStore);
  private pipelineStore = inject(PipelineStore);

  isDark = computed(() => this.themeService.isDark());

  totalClients = this.clientsStore.totalClients;
  activeClients = this.clientsStore.activeClients;
  recentClients = this.clientsStore.recentClients;
  totalPipelineValue = this.pipelineStore.totalPipelineValue;
  weightedValue = this.pipelineStore.weightedValue;
  activeDeals = this.pipelineStore.activeDeals;

  patterns = [
    'SignalStore',
    'withComputed()',
    'computed()',
    'inject()',
    '@defer on viewport',
    '@placeholder',
    '@loading',
    '@for @empty',
    'OnPush',
    'Zoneless',
  ];

  getStatusBadgeClass(status: string): string {
    if (this.isDark()) {
      if (status === 'active') return 'text-green-400 bg-green-900/30 border border-green-800';
      if (status === 'prospect') return 'text-blue-400 bg-blue-900/30 border border-blue-800';
      return 'text-zinc-400 bg-zinc-800/30 border border-zinc-700';
    } else {
      if (status === 'active') return 'text-green-700 bg-green-100 border border-green-300';
      if (status === 'prospect') return 'text-blue-700 bg-blue-100 border border-blue-300';
      return 'text-zinc-700 bg-zinc-200 border border-zinc-300';
    }
  }

  getStatusLabel(status: string): string {
    if (status === 'active') return 'Attivo';
    if (status === 'prospect') return 'Prospect';
    return 'Inattivo';
  }
}
