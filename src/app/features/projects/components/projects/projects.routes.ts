import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectNameResolver } from './project-name.resolver';

export const projectsRoutes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    data: {
      breadcrumb: 'navigation.projects', // Translation key
    },
  },
  {
    path: 'add',
    loadComponent: () =>
      import('../project-form/project-form.component').then(
        (m) => m.ProjectFormComponent,
      ),
    data: {
      title: 'projects.form.title',
      breadcrumb: 'projects.form.title', // Translation key
    },
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('../project-form/project-form.component').then(
        (m) => m.ProjectFormComponent,
      ),
    resolve: {
      projectName: ProjectNameResolver,
    },
  },
];
