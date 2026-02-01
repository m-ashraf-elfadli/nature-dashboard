import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';

export const projectsRoutes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
  },
  {
    path: 'add',
    loadComponent: () =>
      import('../project-form/project-form.component').then(
        (m) => m.ProjectFormComponent,
      ),
    data: {
      title: 'projects.form.title',
    },
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('../project-form/project-form.component').then(
        (m) => m.ProjectFormComponent,
      ),
    data: {
      title: 'projects.form.breadcrumb_edit',
      breadcrumb: 'Add',
    },
  },
];
