import { Routes } from '@angular/router';
import { MainComponent } from './core/layouts/main/main.component';
import { AuthComponent } from './core/layouts/auth/auth.component';
import { dashboardRoutes } from './core/layouts/main/main.routes';
import { authGuard } from './core/guard/auth-gaurd.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: MainComponent,
    children: dashboardRoutes
  },
  {
    path: 'auth',
    component: AuthComponent,
  }
  // {
  //   path: '**',
  //   redirectTo: 'not-found',
  // }
]