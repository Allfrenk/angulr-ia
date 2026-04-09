import { signalStore, withState } from '@ngrx/signals';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
}

interface NavState {
  items: NavItem[];
}

export const NavStore = signalStore(
  { providedIn: 'root' },
  withState<NavState>({
    items: [
      { label: 'Dashboard', route: '/app/dashboard', icon: 'layout-dashboard' },
      { label: 'Clienti', route: '/app/clients', icon: 'users' },
      { label: 'Pipeline', route: '/app/pipeline', icon: 'kanban' },
      { label: 'Performance', route: '/app/performance', icon: 'gauge' },
    ],
  }),
);
