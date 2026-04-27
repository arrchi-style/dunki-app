import { Route } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const appRoutes: Route[] = [
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
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
