import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface AuthUser {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>({
    isAuthenticated: false,
    user: null,
  }),
  withMethods((store) => ({
    login(email: string): void {
      patchState(store, {
        isAuthenticated: true,
        user: { email, name: 'Alessandro Demo' },
      });
    },
    logout(): void {
      patchState(store, { isAuthenticated: false, user: null });
    },
  })),
);
