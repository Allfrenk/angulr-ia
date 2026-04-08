import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const SpotlightStore = signalStore(
  { providedIn: 'root' },
  withState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  }),
  withMethods((store) => ({
    onMouseMove(event: MouseEvent): void {
      patchState(store, {
        x: event.pageX, // pageX tiene conto dello scroll orizzontale
        y: event.pageY, // pageY tiene conto dello scroll verticale
      });
    },
    onMouseLeave(): void {
      // Torna al centro esatto della visuale attuale dell'utente
      patchState(store, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 + window.scrollY,
      });
    },
  })),
);
