import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ServicesComponent } from './pages/services/services.component';
import { AwardsComponent } from './pages/awards/awards.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ClientsComponent },
  {
    path: 'projects',
    loadChildren: () =>
      import('./pages/projects/projects.routes').then((m) => m.projectsRoutes),
  },
  { path: 'services', component: ServicesComponent },
  { path: 'awards', component: AwardsComponent },
  { path: 'testimonials', component: TestimonialsComponent },
];
