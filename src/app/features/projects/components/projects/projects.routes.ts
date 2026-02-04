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
      title: 'general.add',
      breadcrumb: 'general.add',
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
