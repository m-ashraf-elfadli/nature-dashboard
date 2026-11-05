import { Routes } from '@angular/router';

export const aboutUsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/about-us-form/about-us-form.component').then(
        (m) => m.AboutUsFormComponent,
      ),
  },
];
