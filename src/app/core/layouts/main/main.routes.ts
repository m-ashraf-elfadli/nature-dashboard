import { Routes } from '@angular/router';
import { AwardsComponent } from '../../../pages/awards/awards.component';
import { ClientsComponent } from '../../../features/clients/components/clients/clients.component';
import { DashboardComponent } from '../../../pages/dashboard/dashboard.component';
import { TestimonialsComponent } from '../../../features/testimonials/components/testimonials/testimonials.component';
import { AwardFormComponent } from '../../../features/awards/components/award-form/award-form.component';
import { AwardsListComponent } from '../../../features/awards/components/awards-list/awards-list.component';
import { CustomizeAwardSectionFormComponent } from '../../../features/awards/components/customize-award-section-form/customize-award-section-form.component';
import { awardNameResolver } from '../../resolvers/award-name.resolver';

export const dashboardRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ClientsComponent },
  {
    path: 'projects',
    loadChildren: () =>
      import('../../../features/projects/components/projects/projects.routes').then(
        (m) => m.projectsRoutes,
      ),
    data: {
      breadcrumb: 'projects.list.breadcurmb',
    },
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./../../../pages/services/services.routes').then(
        (m) => m.servicesRoutes,
      ),
    data: {
      breadcrumb: 'Services',
    },
  },
  {
    path: 'awards',
    component: AwardsComponent,
    data: {
      breadcrumb: 'awards.list.breadcurmb',
    },
    children: [
      {
        path: '',
        component: AwardsListComponent,
      },
      {
        path: 'add',
        component: AwardFormComponent,
        data: {
          breadcrumb: 'general.add',
        },
      },
      {
        path: 'edit/:id',
        component: AwardFormComponent,
        resolve: {
          awardName: awardNameResolver,
        },
      },
      {
        path: 'customize',
        component: CustomizeAwardSectionFormComponent,
        data: {
          breadcrumb: 'Add New Award',
        },
      },
    ],
  },
  { 
    path: 'testimonials', 
    component: TestimonialsComponent,
    data: {
      breadcrumb: 'testimonials.list.breadcurmb',
    },
  },
];
