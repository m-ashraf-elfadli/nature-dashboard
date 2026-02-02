import { Routes } from '@angular/router';
import { ServicesComponent } from './services.component';
import { ServiceNameResolver } from './service-name.resolver';

export const servicesRoutes: Routes = [
  {
    path: '',
    component: ServicesComponent,
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./service-form/service-form.component').then(
        (m) => m.ServiceFormComponent,
      ),
    data: {
      title: 'Add New Service',
      breadcrumb: 'Add',
    },
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./service-form/service-form.component').then(
        (m) => m.ServiceFormComponent,
      ),
    resolve: {
      serviceName: ServiceNameResolver,
    },
    data: {
      title: 'Edit Service',
    },
  },
];
