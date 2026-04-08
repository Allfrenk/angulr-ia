import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ArrowLeft,
  Building2,
  Clock,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Mail,
  Phone,
  Tag,
} from 'lucide-angular';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme';
import { ClientsStore } from '../../core/store/clients.store';
import { FeaturePill } from '../../shared/components/feature-pill';
import { GridBackground } from '../../shared/components/grid-background';

interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  date: Date;
  description: string;
}

const MOCK_INTERACTIONS: Interaction[] = [
  {
    id: '1',
    type: 'meeting',
    title: 'Demo prodotto',
    date: new Date('2024-03-15'),
    description: 'Presentazione completa della piattaforma. Cliente molto interessato.',
  },
  {
    id: '2',
    type: 'email',
    title: 'Invio proposta commerciale',
    date: new Date('2024-03-20'),
    description: 'Inviata proposta con dettagli pricing e termini contrattuali.',
  },
  {
    id: '3',
    type: 'call',
    title: 'Follow-up proposta',
    date: new Date('2024-04-01'),
    description: 'Cliente ha richiesto modifiche ai termini di pagamento.',
  },
  {
    id: '4',
    type: 'note',
    title: 'Nota interna',
    date: new Date('2024-04-10'),
    description: 'Decisione attesa entro fine mese. Priorità alta.',
  },
];

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [GridBackground, FeaturePill, LucideAngularModule, CurrencyPipe, DatePipe],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ ArrowLeft, Mail, Phone, Building2, Tag, Clock }),
    },
  ],
  template: `
    <app-grid-background [isDark]="isDark()" [disableSpotlight]="true">
      <div class="p-8 max-w-4xl mx-auto space-y-6">
        <!-- BACK BUTTON -->
        <button
          (click)="goBack()"
          class="flex items-center gap-2 text-sm transition-colors cursor-pointer"
          [class.text-zinc-400]="isDark()"
          [class.text-zinc-600]="!isDark()"
          [class.hover:text-white]="isDark()"
          [class.hover:text-zinc-900]="!isDark()"
        >
          <lucide-icon name="arrow-left" [size]="16" />
          Torna ai clienti
        </button>

        @if (client(); as c) {
          <!-- HEADER CARD -->
          <div
            class="rounded-2xl border p-8 flex items-start justify-between gap-6"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <div class="flex items-center gap-5">
              <div
                class="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center shrink-0"
              >
                <span class="text-white font-bold text-2xl">{{ c.name[0] }}</span>
              </div>
              <div>
                <h1
                  class="text-2xl font-bold"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                >
                  {{ c.name }}
                </h1>
                <p
                  class="text-sm mt-0.5"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  {{ c.company }}
                </p>
                <span
                  class="rounded-full px-3 py-1 text-xs border mt-2 inline-block {{
                    getStatusColor(c.status)
                  }}"
                >
                  {{ getStatusLabel(c.status) }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <p
                class="text-xs uppercase tracking-wider"
                [class.text-zinc-500]="isDark()"
                [class.text-zinc-600]="!isDark()"
              >
                Valore contratto
              </p>
              <p class="text-2xl font-bold text-violet-400 mt-1">
                {{ c.value | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
              </p>
            </div>
          </div>

          <!-- INFO GRID -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              class="rounded-xl border p-5 flex items-center gap-4"
              [class.glass-card-dark]="isDark()"
              [class.glass-card-light]="!isDark()"
              [class.border-zinc-800]="isDark()"
              [class.border-zinc-300]="!isDark()"
            >
              <lucide-icon name="mail" [size]="20" class="text-violet-400 shrink-0" />
              <div>
                <p
                  class="text-xs uppercase tracking-wider"
                  [class.text-zinc-500]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  Email
                </p>
                <p
                  class="text-sm font-medium"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                >
                  {{ c.email }}
                </p>
              </div>
            </div>
            <div
              class="rounded-xl border p-5 flex items-center gap-4"
              [class.glass-card-dark]="isDark()"
              [class.glass-card-light]="!isDark()"
              [class.border-zinc-800]="isDark()"
              [class.border-zinc-300]="!isDark()"
            >
              <lucide-icon name="phone" [size]="20" class="text-violet-400 shrink-0" />
              <div>
                <p
                  class="text-xs uppercase tracking-wider"
                  [class.text-zinc-500]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  Telefono
                </p>
                <p
                  class="text-sm font-medium"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                >
                  {{ c.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- TAGS -->
          @if (c.tags.length > 0) {
            <div
              class="rounded-xl border p-5"
              [class.glass-card-dark]="isDark()"
              [class.glass-card-light]="!isDark()"
              [class.border-zinc-800]="isDark()"
              [class.border-zinc-300]="!isDark()"
            >
              <div class="flex items-center gap-2 mb-3">
                <lucide-icon
                  name="tag"
                  [size]="16"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                />
                <p
                  class="text-xs uppercase tracking-wider font-medium"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  Tag
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                @for (tag of c.tags; track tag) {
                  <span
                    class="rounded-full px-3 py-1 text-xs border"
                    [class.bg-zinc-800]="isDark()"
                    [class.bg-zinc-100]="!isDark()"
                    [class.border-zinc-700]="isDark()"
                    [class.border-zinc-300]="!isDark()"
                    [class.text-zinc-400]="isDark()"
                    [class.text-zinc-700]="!isDark()"
                  >
                    {{ tag }}
                  </span>
                }
              </div>
            </div>
          }

          <!-- STORICO INTERAZIONI con @defer on viewport -->
          <div
            class="rounded-2xl border p-6"
            [class.glass-card-dark]="isDark()"
            [class.glass-card-light]="!isDark()"
            [class.border-zinc-800]="isDark()"
            [class.border-zinc-300]="!isDark()"
          >
            <div class="flex items-center gap-2 mb-5">
              <lucide-icon name="clock" [size]="16" class="text-zinc-400" />
              <h2
                class="font-semibold text-sm uppercase tracking-wider"
                [class.text-zinc-400]="isDark()"
                [class.text-zinc-600]="!isDark()"
              >
                Storico Interazioni
              </h2>
            </div>

            @defer (on viewport) {
              <div class="space-y-4">
                @for (interaction of interactions; track interaction.id) {
                  <div
                    class="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                    [class.border-zinc-800]="isDark()"
                    [class.border-zinc-200]="!isDark()"
                  >
                    <div
                      class="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center shrink-0 mt-0.5"
                    >
                      <lucide-icon
                        [name]="getInteractionIcon(interaction.type)"
                        [size]="14"
                        class="text-violet-400"
                      />
                    </div>
                    <div>
                      <p
                        class="text-sm font-medium"
                        [class.text-white]="isDark()"
                        [class.text-zinc-900]="!isDark()"
                      >
                        {{ interaction.title }}
                      </p>
                      <p
                        class="text-xs mt-0.5 mb-1"
                        [class.text-zinc-500]="isDark()"
                        [class.text-zinc-600]="!isDark()"
                      >
                        {{ interaction.date | date: 'dd MMM yyyy' : '' : 'it' }}
                      </p>
                      <p
                        class="text-xs"
                        [class.text-zinc-400]="isDark()"
                        [class.text-zinc-600]="!isDark()"
                      >
                        {{ interaction.description }}
                      </p>
                    </div>
                  </div>
                }
              </div>
            } @placeholder (minimum 0ms) {
              <div class="space-y-4">
                @for (i of [1, 2, 3, 4]; track i) {
                  <div
                    class="h-16 rounded-xl animate-pulse"
                    [class.bg-zinc-800]="isDark()"
                    [class.bg-zinc-200]="!isDark()"
                  ></div>
                }
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-24">
            <p
              class="text-xl font-semibold mb-2"
              [class.text-white]="isDark()"
              [class.text-zinc-900]="!isDark()"
            >
              Cliente non trovato
            </p>
            <p
              class="text-sm mb-6"
              [class.text-zinc-400]="isDark()"
              [class.text-zinc-600]="!isDark()"
            >
              L'ID richiesto non corrisponde a nessun cliente.
            </p>
            <button
              (click)="goBack()"
              class="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Torna ai clienti
            </button>
          </div>
        }

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
              Il clientId viene estratto dalla route con toSignal(route.paramMap). Il client è un
              computed signal che reagisce all'id — se l'id cambia, il computed ricalcola
              automaticamente trovando il cliente corrispondente nello store. Lo storico usa
              &#64;defer on viewport con &#64;placeholder per il lazy rendering.
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
export class ClientDetail {
  private themeService = inject(ThemeService);
  private clientsStore = inject(ClientsStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isDark = computed(() => this.themeService.isDark());

  clientId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));

  client = computed(() => {
    const id = this.clientId();
    if (!id) return null;
    return this.clientsStore.clients().find((c) => c.id === id) ?? null;
  });

  interactions = MOCK_INTERACTIONS;

  getStatusColor(status: string): string {
    if (this.isDark()) {
      if (status === 'active') return 'text-green-400 bg-green-900/30 border-green-800';
      if (status === 'prospect') return 'text-blue-400 bg-blue-900/30 border-blue-800';
      return 'text-zinc-400 bg-zinc-800/30 border-zinc-700';
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

  getInteractionIcon(type: string): string {
    if (type === 'call') return 'phone';
    if (type === 'email') return 'mail';
    if (type === 'meeting') return 'building-2';
    return 'clock';
  }

  goBack(): void {
    this.router.navigate(['/app/clients']);
  }

  patterns = [
    'toSignal()',
    'ActivatedRoute',
    'computed()',
    'paramMap',
    '@defer on viewport',
    '@if @else',
    'inject()',
    'OnPush',
  ];
}
