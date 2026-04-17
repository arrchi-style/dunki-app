import { Route } from '@angular/router';
import { Dashboard } from './features/dashboard';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
