import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { ClientDetail } from './features/clients/client-detail';
import { Clients } from './features/clients/clients';
import { Dashboard } from './features/dashboard/dashboard';
import { Performance } from './features/performance/performance';
import { Pipeline } from './features/pipeline/pipeline';
import { Layout } from './layout/layout';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing').then((m) => m.Landing) },
  { path: 'login', loadComponent: () => import('./features/auth/login').then((m) => m.Login) },
  {
    path: 'app',
    canActivate: [authGuard],
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'clients', component: Clients },
      { path: 'clients/:id', component: ClientDetail },
      { path: 'pipeline', component: Pipeline },
      { path: 'performance', component: Performance },
    ],
  },
  { path: '**', redirectTo: '' },
];
