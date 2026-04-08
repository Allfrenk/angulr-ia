import { CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import {
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Plus,
  Search,
  UserPlus,
  X,
} from 'lucide-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme';
import { ClientsStore } from '../../core/store/clients.store';
import { FeaturePill } from '../../shared/components/feature-pill';
import { GridBackground } from '../../shared/components/grid-background';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    GridBackground,
    FeaturePill,
    LucideAngularModule,
    ReactiveFormsModule,
    FormField,
    CurrencyPipe,
  ],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Search, X, Plus, UserPlus }),
    },
  ],
  template: `
    <app-grid-background [isDark]="isDark()" [disableSpotlight]="true">
      <div class="p-8 max-w-7xl mx-auto space-y-6">
        <!-- HEADER -->
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-2xl font-bold"
              [class.text-white]="isDark()"
              [class.text-zinc-900]="!isDark()"
            >
              Clienti
            </h1>
            <p
              class="text-sm mt-1"
              [class.text-zinc-400]="isDark()"
              [class.text-zinc-600]="!isDark()"
            >
              {{ clientsStore.totalClients() }} clienti totali
            </p>
          </div>
          <button
            (click)="openModal()"
            class="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <lucide-icon name="user-plus" [size]="16" />
            Aggiungi Cliente
          </button>
        </div>

        <!-- SEARCH + FILTRI -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="relative flex-1">
            <lucide-icon
              name="search"
              [size]="16"
              class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              [color]="isDark() ? '#71717a' : '#52525b'"
            />
            <input
              [formControl]="searchControl"
              placeholder="Cerca per nome, azienda, email..."
              class="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-colors"
              [class.bg-zinc-900]="isDark()"
              [class.bg-white]="!isDark()"
              [class.border-zinc-700]="isDark()"
              [class.border-zinc-300]="!isDark()"
              [class.text-white]="isDark()"
              [class.text-zinc-900]="!isDark()"
              [class.placeholder:text-zinc-600]="isDark()"
              [class.placeholder:text-zinc-500]="!isDark()"
            />
            @if (searchControl.value) {
              <button
                (click)="searchControl.reset()"
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
              >
                <lucide-icon name="x" [size]="16" [color]="isDark() ? '#71717a' : '#52525b'" />
              </button>
            }
          </div>
          <div class="flex gap-2 flex-wrap">
            @for (f of filters; track f.key) {
              <button
                (click)="clientsStore.setFilter(f.key)"
                class="px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border"
                [class.bg-violet-600]="clientsStore.statusFilter() === f.key"
                [class.text-white]="clientsStore.statusFilter() === f.key"
                [class.border-violet-600]="clientsStore.statusFilter() === f.key"
                [class.bg-zinc-900]="isDark() && clientsStore.statusFilter() !== f.key"
                [class.bg-white]="!isDark() && clientsStore.statusFilter() !== f.key"
                [class.border-zinc-700]="isDark() && clientsStore.statusFilter() !== f.key"
                [class.border-zinc-300]="!isDark() && clientsStore.statusFilter() !== f.key"
                [class.text-zinc-400]="isDark() && clientsStore.statusFilter() !== f.key"
                [class.text-zinc-700]="!isDark() && clientsStore.statusFilter() !== f.key"
              >
                {{ f.label }}
              </button>
            }
          </div>
        </div>

        <!-- LISTA CLIENTI — render diretto -->
        <div class="space-y-3">
          @for (client of clientsStore.filteredClients(); track client.id) {
            <div
              (click)="navigateToClient(client.id)"
              (keypress)="navigateToClient(client.id)"
              role="button"
              tabindex="0"
              class="flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition-all hover:border-violet-500"
              [class.glass-card-dark]="isDark()"
              [class.glass-card-light]="!isDark()"
              [class.border-zinc-800]="isDark()"
              [class.border-zinc-300]="!isDark()"
            >
              <div
                class="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0"
              >
                <span class="text-white font-semibold text-sm">{{ client.name[0] }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p
                  class="font-medium text-sm"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                >
                  {{ client.name }}
                </p>
                <p
                  class="text-xs truncate"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                >
                  {{ client.company }} · {{ client.email }}
                </p>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-xs border shrink-0 {{
                  getStatusColor(client.status)
                }}"
              >
                {{ getStatusLabel(client.status) }}
              </span>
              <span class="text-sm font-semibold text-violet-400 shrink-0">
                {{ client.value | currency: 'EUR' : 'symbol' : '1.0-0' : 'it' }}
              </span>
            </div>
          } @empty {
            <div class="text-center py-16">
              <p class="mb-4" [class.text-zinc-400]="isDark()" [class.text-zinc-600]="!isDark()">
                Nessun cliente trovato
              </p>
              <button
                (click)="openModal()"
                class="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Aggiungi il primo cliente
              </button>
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
              La search usa RxJS con debounceTime(300) + distinctUntilChanged() +
              takeUntilDestroyed() per aggiornare il signal searchQuery nello store. filteredClients
              è un computed signal che reagisce a searchQuery e statusFilter — dati sincroni, render
              diretto senza lazy loading. Il modal usa Signal Forms (API sperimentale Angular 21)
              con validazione reattiva.
            </p>
          </div>
        } @placeholder {
          <ng-container></ng-container>
        } @loading {
          <ng-container></ng-container>
        }
      </div>

      <!-- MODAL AGGIUNTA CLIENTE -->
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
                Nuovo Cliente
              </h2>
              <button
                (click)="closeModal()"
                class="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <lucide-icon name="x" [size]="20" [color]="isDark() ? '#71717a' : '#52525b'" />
              </button>
            </div>

            <div class="space-y-4">
              <!-- Nome -->
              <div class="flex flex-col gap-1">
                <label
                  for="client-name"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Nome *</label
                >
                <input
                  id="client-name"
                  type="text"
                  [formField]="newClientForm.name"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                />
                @if (newClientForm.name().touched() && newClientForm.name().invalid()) {
                  @for (err of newClientForm.name().errors(); track err.kind) {
                    <span class="text-xs text-red-400">{{ err.message }}</span>
                  }
                }
              </div>

              <!-- Email -->
              <div class="flex flex-col gap-1">
                <label
                  for="client-email"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Email *</label
                >
                <input
                  id="client-email"
                  type="email"
                  [formField]="newClientForm.email"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                />
                @if (newClientForm.email().touched() && newClientForm.email().invalid()) {
                  @for (err of newClientForm.email().errors(); track err.kind) {
                    <span class="text-xs text-red-400">{{ err.message }}</span>
                  }
                }
              </div>

              <!-- Azienda -->
              <div class="flex flex-col gap-1">
                <label
                  for="client-company"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Azienda *</label
                >
                <input
                  id="client-company"
                  type="text"
                  [formField]="newClientForm.company"
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
                  for="client-phone"
                  class="text-xs font-medium uppercase tracking-wider"
                  [class.text-zinc-400]="isDark()"
                  [class.text-zinc-600]="!isDark()"
                  >Telefono</label
                >
                <input
                  id="client-phone"
                  type="tel"
                  [formField]="newClientForm.phone"
                  class="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                  [class.bg-zinc-800]="isDark()"
                  [class.bg-zinc-50]="!isDark()"
                  [class.border-zinc-700]="isDark()"
                  [class.border-zinc-300]="!isDark()"
                  [class.text-white]="isDark()"
                  [class.text-zinc-900]="!isDark()"
                />
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
                (click)="submitClient()"
                [disabled]="isSubmitting()"
                class="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                @if (isSubmitting()) {
                  Salvataggio...
                } @else {
                  Salva Cliente
                }
              </button>
            </div>
          </div>
        </div>
      }
    </app-grid-background>
  `,
})
export class Clients {
  private themeService = inject(ThemeService);
  protected clientsStore = inject(ClientsStore);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isDark = computed(() => this.themeService.isDark());

  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => this.clientsStore.setSearch(q ?? ''));
  }

  filters: { key: 'all' | 'active' | 'inactive' | 'prospect'; label: string }[] = [
    { key: 'all', label: 'Tutti' },
    { key: 'active', label: 'Attivi' },
    { key: 'prospect', label: 'Prospect' },
    { key: 'inactive', label: 'Inattivi' },
  ];

  showModal = signal(false);
  isSubmitting = signal(false);

  newClientModel = signal({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'prospect' as 'active' | 'inactive' | 'prospect',
    value: 0,
  });

  newClientForm = form(this.newClientModel, (path) => {
    required(path.name, { message: 'Nome obbligatorio' });
    required(path.company, { message: 'Azienda obbligatoria' });
    email(path.email, { message: 'Email non valida' });
    required(path.email, { message: 'Email obbligatoria' });
  });

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  submitClient(): void {
    if (this.newClientForm.name().invalid() || this.newClientForm.email().invalid()) return;
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.clientsStore.addClient({
        name: this.newClientForm.name().value(),
        email: this.newClientForm.email().value(),
        phone: this.newClientForm.phone().value(),
        company: this.newClientForm.company().value(),
        status: 'prospect',
        value: 0,
        tags: ['new'],
      });
      this.isSubmitting.set(false);
      this.closeModal();
      this.newClientModel.set({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'prospect',
        value: 0,
      });
    }, 600);
  }

  navigateToClient(id: string): void {
    this.router.navigate(['/app/clients', id]);
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

  patterns = [
    'SignalStore',
    'filteredClients computed',
    'RxJS debounce',
    'distinctUntilChanged',
    'takeUntilDestroyed',
    'Signal Forms',
    'form()',
    'FormField',
    'required()',
    'email()',
    '@defer on viewport',
    'signal()',
    'inject()',
    'OnPush',
  ];
}
