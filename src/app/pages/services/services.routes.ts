import { Routes } from '@angular/router';
import { ServicesComponent } from './services.component';
import { ServiceNameResolver } from './service-name.resolver';

export const servicesRoutes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    data: {
      breadcrumb: 'navigation.services', // Translation key for "Services"
    },
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./service-form/service-form.component').then(
        (m) => m.ServiceFormComponent,
      ),
    data: {
      title: 'services.form.title', // Translation key: "Add New Service"
      breadcrumb: 'services.form.title', // Translation key
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
      title: 'services.form.update_title',
      breadcrumb: 'services.form.update_title',
    },
  },
];
