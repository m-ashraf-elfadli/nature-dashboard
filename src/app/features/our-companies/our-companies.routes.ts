import { Routes } from '@angular/router';

export const ourCompaniesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/companies-list/companies-list.component').then(
        (m) => m.CompaniesListComponent,
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/company-form/company-form.component').then(
        (m) => m.CompanyFormComponent,
      ),
    data: { breadcrumb: 'our_companies.form.add_breadcrumb' },
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/company-form/company-form.component').then(
        (m) => m.CompanyFormComponent,
      ),
    data: { breadcrumb: 'our_companies.form.edit_breadcrumb' },
  },
];
