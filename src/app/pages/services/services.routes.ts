import { Routes } from '@angular/router';
import { ServicesComponent } from './services.component';

export const servicesRoutes: Routes = [
  {
    path: '',
    component: ServicesComponent,
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./service-form/service-form.component').then(
        (m) => m.ServiceFormComponent
      ),
    data: {
      title: 'Add New Service',
    },
  },
];
