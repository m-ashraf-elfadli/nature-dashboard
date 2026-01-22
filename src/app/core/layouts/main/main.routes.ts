import { Routes } from '@angular/router';
import { AwardsComponent } from '../../../pages/awards/awards.component';
import { ClientsComponent } from '../../../features/clients/components/clients/clients.component';
import { DashboardComponent } from '../../../pages/dashboard/dashboard.component';
import { ServicesComponent } from '../../../pages/services/services.component';
import { TestimonialsComponent } from '../../../pages/testimonials/testimonials.component';


export const dashboardRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ClientsComponent },
  {
    path: 'projects',
    loadChildren: () =>
      import('./../../../pages/projects/projects.routes').then((m) => m.projectsRoutes),
  },
  { path: 'services', component: ServicesComponent },
  { path: 'awards', component: AwardsComponent },
  { path: 'testimonials', component: TestimonialsComponent },
];
