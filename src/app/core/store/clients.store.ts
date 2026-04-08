import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'prospect';
  value: number;
  createdAt: Date;
  tags: string[];
}

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    email: 'marco@techcorp.it',
    phone: '+39 02 1234567',
    company: 'TechCorp SRL',
    status: 'active',
    value: 12000,
    createdAt: new Date('2024-01-15'),
    tags: ['enterprise', 'priority'],
  },
  {
    id: '2',
    name: 'Sara Bianchi',
    email: 'sara@designlab.it',
    phone: '+39 02 2345678',
    company: 'DesignLab',
    status: 'active',
    value: 5500,
    createdAt: new Date('2024-02-20'),
    tags: ['agency'],
  },
  {
    id: '3',
    name: 'Luca Ferrari',
    email: 'luca@startup.io',
    phone: '+39 02 3456789',
    company: 'StartupIO',
    status: 'prospect',
    value: 3000,
    createdAt: new Date('2024-03-10'),
    tags: ['startup', 'new'],
  },
  {
    id: '4',
    name: 'Anna Conti',
    email: 'anna@retail.com',
    phone: '+39 02 4567890',
    company: 'Retail Plus',
    status: 'active',
    value: 8200,
    createdAt: new Date('2024-03-25'),
    tags: ['retail'],
  },
  {
    id: '5',
    name: 'Giuseppe Marino',
    email: 'giuseppe@finance.it',
    phone: '+39 02 5678901',
    company: 'Finance Group',
    status: 'inactive',
    value: 15000,
    createdAt: new Date('2024-01-05'),
    tags: ['enterprise', 'finance'],
  },
  {
    id: '6',
    name: 'Elena Romano',
    email: 'elena@consulting.it',
    phone: '+39 02 6789012',
    company: 'Romano Consulting',
    status: 'active',
    value: 6800,
    createdAt: new Date('2024-04-01'),
    tags: ['consulting'],
  },
  {
    id: '7',
    name: 'Davide Esposito',
    email: 'davide@media.it',
    phone: '+39 02 7890123',
    company: 'Media Hub',
    status: 'prospect',
    value: 2500,
    createdAt: new Date('2024-04-15'),
    tags: ['media', 'new'],
  },
  {
    id: '8',
    name: 'Chiara Lombardi',
    email: 'chiara@health.it',
    phone: '+39 02 8901234',
    company: 'Health Solutions',
    status: 'active',
    value: 9400,
    createdAt: new Date('2024-02-08'),
    tags: ['healthcare', 'priority'],
  },
];

interface ClientsState {
  clients: Client[];
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'inactive' | 'prospect';
  isLoading: boolean;
  selectedClientId: string | null;
}

export const ClientsStore = signalStore(
  { providedIn: 'root' },
  withState<ClientsState>({
    clients: MOCK_CLIENTS,
    searchQuery: '',
    statusFilter: 'all',
    isLoading: false,
    selectedClientId: null,
  }),
  withComputed(({ clients, searchQuery, statusFilter }) => ({
    filteredClients: computed(() => {
      let result = clients();
      const q = searchQuery().toLowerCase().trim();
      if (q) {
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q),
        );
      }
      if (statusFilter() !== 'all') {
        result = result.filter((c) => c.status === statusFilter());
      }
      return result;
    }),
    totalClients: computed(() => clients().length),
    activeClients: computed(() => clients().filter((c) => c.status === 'active').length),
    prospectClients: computed(() => clients().filter((c) => c.status === 'prospect').length),
    inactiveClients: computed(() => clients().filter((c) => c.status === 'inactive').length),
    totalValue: computed(() => clients().reduce((sum, c) => sum + c.value, 0)),
    recentClients: computed(() =>
      [...clients()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5),
    ),
  })),
  withMethods((store) => ({
    setSearch(q: string): void {
      patchState(store, { searchQuery: q });
    },
    setFilter(f: 'all' | 'active' | 'inactive' | 'prospect'): void {
      patchState(store, { statusFilter: f });
    },
    selectClient(id: string | null): void {
      patchState(store, { selectedClientId: id });
    },
    addClient(client: Omit<Client, 'id' | 'createdAt'>): void {
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      patchState(store, { clients: [...store.clients(), newClient] });
    },
    updateClient(id: string, changes: Partial<Omit<Client, 'id' | 'createdAt'>>): void {
      patchState(store, {
        clients: store.clients().map((c) => (c.id === id ? { ...c, ...changes } : c)),
      });
    },
    getClientById(id: string): Client | undefined {
      return store.clients().find((c) => c.id === id);
    },
  })),
);
