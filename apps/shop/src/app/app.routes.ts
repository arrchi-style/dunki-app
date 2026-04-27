import { Route } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard.component';

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
