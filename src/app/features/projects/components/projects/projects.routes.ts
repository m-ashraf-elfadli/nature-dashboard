import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectNameResolver } from './project-name.resolver';

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
      breadcrumb: 'Add',
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
    },
    resolve: {
      projectName: ProjectNameResolver,
    },
  },
];
