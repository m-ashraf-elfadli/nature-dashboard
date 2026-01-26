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
        (m) => m.ProjectFormComponent
      ),
    data: {
      title: 'Add New Project',
    },
  },
];
