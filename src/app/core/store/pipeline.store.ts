import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export type DealStage =
  | 'lead'
  | 'contact'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Deal {
  id: string;
  clientName: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedClose: Date;
  notes: string;
}

export interface StageConfig {
  key: DealStage;
  label: string;
  darkColorClass: string;
  lightColorClass: string;
  darkTextClass: string;
  lightTextClass: string;
}

export const STAGES: StageConfig[] = [
  {
    key: 'lead',
    label: 'Lead',
    darkColorClass: 'bg-zinc-700',
    lightColorClass: 'bg-zinc-400',
    darkTextClass: 'text-zinc-400',
    lightTextClass: 'text-zinc-700',
  },
  {
    key: 'contact',
    label: 'Contatto',
    darkColorClass: 'bg-blue-600',
    lightColorClass: 'bg-blue-500',
    darkTextClass: 'text-blue-400',
    lightTextClass: 'text-blue-700',
  },
  {
    key: 'proposal',
    label: 'Proposta',
    darkColorClass: 'bg-violet-600',
    lightColorClass: 'bg-violet-500',
    darkTextClass: 'text-violet-400',
    lightTextClass: 'text-violet-700',
  },
  {
    key: 'negotiation',
    label: 'Trattativa',
    darkColorClass: 'bg-amber-600',
    lightColorClass: 'bg-amber-500',
    darkTextClass: 'text-amber-400',
    lightTextClass: 'text-amber-700',
  },
  {
    key: 'closed_won',
    label: 'Chiuso ✓',
    darkColorClass: 'bg-green-600',
    lightColorClass: 'bg-green-500',
    darkTextClass: 'text-green-400',
    lightTextClass: 'text-green-700',
  },
  {
    key: 'closed_lost',
    label: 'Perso ✗',
    darkColorClass: 'bg-red-600',
    lightColorClass: 'bg-red-500',
    darkTextClass: 'text-red-400',
    lightTextClass: 'text-red-700',
  },
];

const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    clientName: 'Marco Rossi',
    company: 'TechCorp SRL',
    value: 12000,
    stage: 'negotiation',
    probability: 75,
    expectedClose: new Date('2024-06-30'),
    notes: 'Demo completata, in attesa approvazione budget',
  },
  {
    id: '2',
    clientName: 'Sara Bianchi',
    company: 'DesignLab',
    value: 5500,
    stage: 'proposal',
    probability: 50,
    expectedClose: new Date('2024-07-15'),
    notes: 'Proposta inviata il 10 aprile',
  },
  {
    id: '3',
    clientName: 'Luca Ferrari',
    company: 'StartupIO',
    value: 3000,
    stage: 'contact',
    probability: 30,
    expectedClose: new Date('2024-08-01'),
    notes: 'Primo contatto positivo',
  },
  {
    id: '4',
    clientName: 'Paolo Greco',
    company: 'Greco & Partners',
    value: 7500,
    stage: 'lead',
    probability: 15,
    expectedClose: new Date('2024-09-01'),
    notes: 'Referral da TechCorp',
  },
  {
    id: '5',
    clientName: 'Anna Conti',
    company: 'Retail Plus',
    value: 8200,
    stage: 'closed_won',
    probability: 100,
    expectedClose: new Date('2024-04-01'),
    notes: 'Contratto firmato',
  },
  {
    id: '6',
    clientName: 'Roberto Neri',
    company: 'Neri Industrie',
    value: 4200,
    stage: 'closed_lost',
    probability: 0,
    expectedClose: new Date('2024-03-15'),
    notes: 'Ha scelto un competitor',
  },
  {
    id: '7',
    clientName: 'Chiara Lombardi',
    company: 'Health Solutions',
    value: 9400,
    stage: 'negotiation',
    probability: 80,
    expectedClose: new Date('2024-06-15'),
    notes: 'Revisione contratto in corso',
  },
  {
    id: '8',
    clientName: 'Elena Romano',
    company: 'Romano Consulting',
    value: 6800,
    stage: 'proposal',
    probability: 60,
    expectedClose: new Date('2024-07-30'),
    notes: 'Meeting fissato prossima settimana',
  },
];

interface PipelineState {
  deals: Deal[];
  isLoading: boolean;
}

export const PipelineStore = signalStore(
  { providedIn: 'root' },
  withState<PipelineState>({ deals: MOCK_DEALS, isLoading: false }),
  withComputed(({ deals }) => ({
    dealsByStage: computed(() => {
      const map = new Map<DealStage, Deal[]>();
      STAGES.forEach((s) => map.set(s.key, []));
      deals().forEach((d) => {
        const list = map.get(d.stage);
        if (list) list.push(d);
      });
      return map;
    }),
    totalPipelineValue: computed(() =>
      deals()
        .filter((d) => d.stage !== 'closed_lost')
        .reduce((s, d) => s + d.value, 0),
    ),
    wonValue: computed(() =>
      deals()
        .filter((d) => d.stage === 'closed_won')
        .reduce((s, d) => s + d.value, 0),
    ),
    weightedValue: computed(() => deals().reduce((s, d) => s + (d.value * d.probability) / 100, 0)),
    activeDeals: computed(() =>
      deals().filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost'),
    ),
  })),
  withMethods((store) => ({
    moveToStage(dealId: string, stage: DealStage): void {
      patchState(store, {
        deals: store.deals().map((d) => (d.id === dealId ? { ...d, stage } : d)),
      });
    },
    addDeal(deal: Omit<Deal, 'id'>): void {
      patchState(store, {
        deals: [...store.deals(), { ...deal, id: Date.now().toString() }],
      });
    },
  })),
);
