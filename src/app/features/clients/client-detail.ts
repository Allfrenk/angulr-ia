import { CurrencyPipe, DatePipe, Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { email, form, FormField, required } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import {
  ArrowLeft,
  Building2,
  Clock,
  Edit,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Mail,
  Phone,
  Plus,
  Tag,
  X,
} from 'lucide-angular';
import { map } from 'rxjs/operators';
import { getTagClasses, PREDEFINED_TAGS } from '../../core/data/tags';
import { ThemeService } from '../../core/services/theme';
import { Client, ClientsStore } from '../../core/store/clients.store';
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
  imports: [GridBackground, FeaturePill, LucideAngularModule, CurrencyPipe, DatePipe, FormField],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        ArrowLeft,
        Mail,
        Phone,
        Building2,
        Tag,
        Clock,
        Edit,
        X,
        Plus,
      }),
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
            <div class="flex flex-col items-end gap-3">
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
              <button
                (click)="openEditModal(c)"
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border"
                [class.border-zinc-700]="isDark()"
                [class.border-zinc-300]="!isDark()"
                [class.text-zinc-300]="isDark()"
                [class.text-zinc-700]="!isDark()"
                [class.hover:border-violet-500]="true"
                [class.hover:text-violet-400]="isDark()"
                [class.hover:text-violet-600]="!isDark()"
              >
                <lucide-icon name="edit" [size]="14" />
                Modifica
              </button>
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
                  <span [class]="getTagClasses(tag, isDark())">{{ tag }}</span>
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
              automaticamente trovando il cliente corrispondente nello store. Il modal di modifica
              usa Signal Forms (API sperimentale Angular 21): editModel è un signal&lt;T&gt; passato
              a form() che crea un FieldTree reattivo pre-popolato con i dati del cliente.
            </p>
          </div>
        } @placeholder {
          <ng-container></ng-container>
        } @loading {
          <ng-container></ng-container>
        }
      </div>

      <!-- MODAL MODIFICA CLIENTE -->
      @if (showEditModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            class="absolute inset-0 bg-black/60"
            (click)="closeEditModal()"
            (keypress)="closeEditModal()"
            role="button"
            tabindex="0"
          ></div>
          <div
            class="relative z-10 w-full max-w-md rounded-2xl border p-8 space-y-4"
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
                Modifica Cliente
              </h2>
              <button
                (click)="closeEditModal()"
                class="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <lucide-icon name="x" [size]="20" [color]="isDark() ? '#71717a' : '#52525b'" />
              </button>
            </div>

            <div class="space-y-4">
              <!-- Nome -->
              <div class="flex flex-col gap-1">
                <label
                  for="edit-name"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Nome *</label
                >
                <input
                  id="edit-name"
                  type="text"
                  [formField]="editForm.name"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                />
                @if (editForm.name().touched() && editForm.name().invalid()) {
                  @for (err of editForm.name().errors(); track err.kind) {
                    <span class="text-xs text-red-400">{{ err.message }}</span>
                  }
                }
              </div>

              <!-- Email -->
              <div class="flex flex-col gap-1">
                <label
                  for="edit-email"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Email *</label
                >
                <input
                  id="edit-email"
                  type="email"
                  [formField]="editForm.email"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                />
                @if (editForm.email().touched() && editForm.email().invalid()) {
                  @for (err of editForm.email().errors(); track err.kind) {
                    <span class="text-xs text-red-400">{{ err.message }}</span>
                  }
                }
              </div>

              <!-- Azienda -->
              <div class="flex flex-col gap-1">
                <label
                  for="edit-company"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Azienda *</label
                >
                <input
                  id="edit-company"
                  type="text"
                  [formField]="editForm.company"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                />
              </div>

              <!-- Telefono -->
              <div class="flex flex-col gap-1">
                <label
                  for="edit-phone"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Telefono</label
                >
                <input
                  id="edit-phone"
                  type="tel"
                  [formField]="editForm.phone"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                />
              </div>

              <!-- TAG -->
              <div class="flex flex-col gap-2">
                <p
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  Tag attivi
                </p>
                <div class="flex flex-wrap gap-2">
                  @for (tag of editTags(); track tag) {
                    <span class="flex items-center gap-1 {{ getTagClasses(tag, isDark()) }}">
                      {{ tag }}
                      <button
                        (click)="removeTag(tag)"
                        class="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer leading-none"
                      >
                        <lucide-icon name="x" [size]="10" />
                      </button>
                    </span>
                  }
                </div>
                <p
                  class="text-xs"
                  [class.text-zinc-500]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  Aggiungi tag:
                </p>
                <div class="flex flex-wrap gap-2">
                  @for (t of predefinedTags; track t.label) {
                    @if (!editTags().includes(t.label)) {
                      <button
                        (click)="addTag(t.label)"
                        class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border cursor-pointer hover:opacity-80 transition-opacity"
                        [class]="getTagClasses(t.label, isDark())"
                      >
                        <lucide-icon name="plus" [size]="10" />
                        {{ t.label }}
                      </button>
                    }
                  }
                </div>
                <p
                  class="text-xs leading-relaxed mt-1"
                  [class.text-zinc-500]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  I tag sono definiti in una mappa predefinita (<code>tags.ts</code>). In un'app
                  reale i nuovi tag verrebbero salvati su DB per garantire persistenza e
                  condivisione tra utenti.
                </p>
              </div>

              <!-- Status -->
              <div class="flex flex-col gap-1">
                <label
                  for="edit-status"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Stato</label
                >
                <select
                  id="edit-status"
                  [value]="editStatus()"
                  (change)="editStatus.set($any($event.target).value)"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors appearance-none cursor-pointer"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                >
                  <option value="active">Attivo</option>
                  <option value="prospect">Prospect</option>
                  <option value="inactive">Inattivo</option>
                </select>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                (click)="closeEditModal()"
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
                (click)="saveEdit()"
                [disabled]="isSaving()"
                class="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                @if (isSaving()) {
                  Salvataggio...
                } @else {
                  Salva modifiche
                }
              </button>
            </div>
          </div>
        </div>
      }
    </app-grid-background>
  `,
})
export class ClientDetail {
  private themeService = inject(ThemeService);
  private clientsStore = inject(ClientsStore);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  isDark = computed(() => this.themeService.isDark());

  clientId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));

  client = computed(() => {
    const id = this.clientId();
    if (!id) return null;
    return this.clientsStore.clients().find((c) => c.id === id) ?? null;
  });

  interactions = MOCK_INTERACTIONS;

  getTagClasses = getTagClasses;
  predefinedTags = PREDEFINED_TAGS;

  // — Edit modal —
  showEditModal = signal(false);
  isSaving = signal(false);
  editStatus = signal<'active' | 'inactive' | 'prospect'>('active');
  editTags = signal<string[]>([]);

  editModel = signal({ name: '', email: '', phone: '', company: '' });

  editForm = form(this.editModel, (path) => {
    required(path.name, { message: 'Nome obbligatorio' });
    required(path.company, { message: 'Azienda obbligatoria' });
    email(path.email, { message: 'Email non valida' });
    required(path.email, { message: 'Email obbligatoria' });
  });

  openEditModal(c: Client): void {
    this.editModel.set({ name: c.name, email: c.email, phone: c.phone, company: c.company });
    this.editStatus.set(c.status);
    this.editTags.set([...c.tags]);
    this.showEditModal.set(true);
  }

  addTag(tag: string): void {
    if (!this.editTags().includes(tag)) {
      this.editTags.update((tags) => [...tags, tag]);
    }
  }

  removeTag(tag: string): void {
    this.editTags.update((tags) => tags.filter((t) => t !== tag));
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }

  saveEdit(): void {
    if (this.editForm.name().invalid() || this.editForm.email().invalid()) return;
    const id = this.clientId();
    if (!id) return;
    this.isSaving.set(true);
    setTimeout(() => {
      this.clientsStore.updateClient(id, {
        name: this.editForm.name().value(),
        email: this.editForm.email().value(),
        phone: this.editForm.phone().value(),
        company: this.editForm.company().value(),
        status: this.editStatus(),
        tags: this.editTags(),
      });
      this.isSaving.set(false);
      this.closeEditModal();
    }, 500);
  }

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
    this.location.back();
  }

  patterns = [
    'toSignal()',
    'ActivatedRoute',
    'computed()',
    'paramMap',
    'Signal Forms',
    'form()',
    'FormField',
    'updateClient()',
    '@defer on viewport',
    '@if @else',
    'inject()',
    'OnPush',
  ];
}
