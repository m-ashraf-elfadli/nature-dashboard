import { Routes } from '@angular/router';

export const blogsRoutes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  {
    path: 'categories',
    loadComponent: () =>
      import('./components/blog-categories/blog-categories.component').then(
        (m) => m.BlogCategoriesComponent,
      ),
    data: {
      breadcrumb: 'blogs.categories.breadcrumb',
    },
  },
  {
    path: 'posts/add',
    loadComponent: () =>
      import('./components/blog-post-form/blog-post-form.component').then(
        (m) => m.BlogPostFormComponent,
      ),
    data: {
      breadcrumb: 'blogs.posts.form.title',
    },
  },
  {
    path: 'posts/edit/:id',
    loadComponent: () =>
      import('./components/blog-post-form/blog-post-form.component').then(
        (m) => m.BlogPostFormComponent,
      ),
    data: {
      breadcrumb: 'blogs.posts.form.edit_title',
    },
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./components/blog-posts/blog-posts.component').then(
        (m) => m.BlogPostsComponent,
      ),
    data: {
      breadcrumb: 'blogs.posts.breadcrumb',
    },
  },
];
