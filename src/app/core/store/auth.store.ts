import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

export interface AuthUser {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const AUTH_KEY = 'crm_auth';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>({
    isAuthenticated: false,
    user: null,
  }),
  withMethods((store) => ({
    login(email: string): void {
      const user: AuthUser = { email, name: 'Alessandro Demo' };
      patchState(store, { isAuthenticated: true, user });
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } catch {
        // localStorage non disponibile (SSR / private browsing)
      }
    },
    logout(): void {
      patchState(store, { isAuthenticated: false, user: null });
      try {
        localStorage.removeItem(AUTH_KEY);
      } catch {
        // localStorage non disponibile
      }
    },
  })),
  withHooks({
    onInit(store): void {
      try {
        const saved = localStorage.getItem(AUTH_KEY);
        if (saved) {
          const user = JSON.parse(saved) as AuthUser;
          if (user?.email && user?.name) {
            patchState(store, { isAuthenticated: true, user });
          }
        }
      } catch {
        // JSON malformato o localStorage non disponibile
      }
    },
  }),
);
