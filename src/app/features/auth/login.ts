import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, FormField, readonly as readonlyField, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Eye, EyeOff, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { ThemeService } from '../../core/services/theme';
import { AuthStore } from '../../core/store/auth.store';
import { FeaturePill } from '../../shared/components/feature-pill';
import { GridBackground } from '../../shared/components/grid-background';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LucideAngularModule, GridBackground, FeaturePill, FormField],
  providers: [
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Eye, EyeOff }) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-grid-background [isDark]="isDark()">
      <main
        class="relative z-20 flex flex-col items-center justify-center min-h-screen gap-8 px-8 py-24 text-center cursor-default "
      >
        <!-- A) Header -->
        <div
          class="flex flex-col gap-3"
          style="animation: fadeUp 0.5s ease both; animation-delay: 0ms"
        >
          <h1
            class="font-bold text-2xl"
            [class.text-white]="isDark()"
            [class.text-zinc-900]="!isDark()"
          >
            Accesso Demo
          </h1>
          <p
            class="text-sm max-w-sm leading-relaxed"
            [class.text-zinc-400]="isDark()"
            [class.text-zinc-500]="!isDark()"
          >
            Questo form simula un login con credenziali precompilate. In un'app reale, i valori
            sarebbero gestiti tramite Signal Forms con validazione reattiva.
          </p>
        </div>

        <!-- B) Form card -->
        <div
          class="rounded-2xl border p-8 w-full max-w-sm flex flex-col gap-6"
          [class.bg-zinc-900]="isDark()"
          [class.bg-white]="!isDark()"
          [class.border-zinc-800]="isDark()"
          [class.border-zinc-200]="!isDark()"
          style="animation: fadeUp 0.5s ease both; animation-delay: 80ms"
        >
          <!-- B1) Email -->
          <div class="flex flex-col gap-2 text-left">
            <label
              for="email-input"
              class="text-xs font-medium uppercase tracking-wider"
              [class.text-zinc-400]="isDark()"
              [class.text-zinc-500]="!isDark()"
              >Email</label
            >
            <input
              id="email-input"
              type="email"
              [formField]="loginForm.email"
              class="w-full rounded-xl px-4 py-3 text-sm border outline-none cursor-not-allowed"
              [class.bg-zinc-800]="isDark()"
              [class.bg-zinc-100]="!isDark()"
              [class.border-zinc-700]="isDark()"
              [class.border-zinc-200]="!isDark()"
              [class.text-zinc-300]="isDark()"
              [class.text-zinc-600]="!isDark()"
            />
          </div>

          <!-- B2) Password -->
          <div class="flex flex-col gap-2 text-left">
            <label
              for="password-input"
              class="text-xs font-medium uppercase tracking-wider"
              [class.text-zinc-400]="isDark()"
              [class.text-zinc-500]="!isDark()"
              >Password</label
            >
            <div class="relative">
              <input
                id="password-input"
                [type]="inputType()"
                [formField]="loginForm.password"
                class="w-full rounded-xl px-4 py-3 pr-12 text-sm border outline-none cursor-not-allowed"
                [class.bg-zinc-800]="isDark()"
                [class.bg-zinc-100]="!isDark()"
                [class.border-zinc-700]="isDark()"
                [class.border-zinc-200]="!isDark()"
                [class.text-zinc-300]="isDark()"
                [class.text-zinc-600]="!isDark()"
              />
              <button
                (click)="togglePassword()"
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
                type="button"
              >
                <lucide-icon
                  [name]="showPassword() ? 'eye-off' : 'eye'"
                  [size]="18"
                  [color]="isDark() ? '#71717a' : '#a1a1aa'"
                />
              </button>
            </div>
          </div>

          <!-- B3) Login button -->
          <button
            (click)="login()"
            [disabled]="isLoading()"
            class="w-full rounded-xl py-3 text-sm font-semibold transition-all bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            @if (isLoading()) {
              Accesso in corso...
            } @else {
              Accedi alla demo
            }
          </button>
        </div>

        <!-- C) Pattern info -->
        <div
          class="flex flex-col items-center gap-4"
          style="animation: fadeUp 0.5s ease both; animation-delay: 160ms"
        >
          <span
            class="text-xs uppercase tracking-wider font-medium"
            [class.text-zinc-500]="isDark()"
            [class.text-zinc-400]="!isDark()"
            >Pattern utilizzati in questo componente</span
          >

          <div class="flex flex-wrap justify-center gap-2 max-w-sm">
            @for (p of patterns; track p) {
              <app-feature-pill [isDark]="isDark()" [label]="p" />
            }
          </div>

          <p
            class="text-xs max-w-sm leading-relaxed"
            [class.text-zinc-500]="isDark()"
            [class.text-zinc-600]="!isDark()"
          >
            <strong>Signal Forms</strong> (API sperimentale Angular 21) — loginModel è un
            signal&lt;LoginData&gt; passato a form() che crea un FieldTree reattivo. [formField]
            direttiva fa il binding bidirezionale tra input e signal. I campi sono readonly per
            simulare credenziali pre-autenticate. showPassword usa computed() per derivare il tipo
            dell'input. isLoading gestisce lo stato asincrono del login.
          </p>
        </div>
      </main>
    </app-grid-background>
  `,
})
export class Login {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private authStore = inject(AuthStore);
  isDark = computed(() => this.themeService.isDark());
  loginModel = signal<LoginData>({
    email: 'demo@crm.io',
    password: 'demo1234',
  });

  loginForm = form(this.loginModel, (path) => {
    required(path.email, { message: 'Email obbligatoria' });
    required(path.password, { message: 'Password obbligatoria' });
    readonlyField(path.email);
    readonlyField(path.password);
  });

  showPassword = signal(false);
  isLoading = signal(false);

  inputType = computed(() => (this.showPassword() ? 'text' : 'password'));

  patterns = [
    'Signal Forms',
    'form()',
    'FormField',
    'required()',
    'signal()',
    'computed()',
    'readonly state',
    'showPassword toggle',
    'isLoading',
    'OnPush',
    'inject()',
  ];

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  login(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.authStore.login(this.loginForm.email().value());
      this.isLoading.set(false);
      this.router.navigate(['/app/dashboard']);
    }, 800);
  }
}
