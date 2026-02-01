import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent implements OnInit {
  @Input() title: string = '';
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.breadcrumbs = [{ label: 'Dashboard', route: '/' }];

    this.buildBreadcrumbs(this.route.root);
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '') {
    for (const child of route.children) {
      const segment = child.snapshot.url.map((s) => s.path).join('/');

      if (segment) {
        url += `/${segment}`;
      }

      const data = child.snapshot.data;

      // ✅ أضف breadcrumb بس لو في segment حقيقي
      if (data?.['breadcrumb'] && segment) {
        this.breadcrumbs.push({
          label: data['breadcrumb'],
          route: url,
        });
      }

      // ✅ edit → replace last breadcrumb باسم الخدمة
      if (data?.['serviceName']) {
        this.breadcrumbs[this.breadcrumbs.length - 1] = {
          label: data['serviceName'],
          route: undefined,
        };
      }

      if (data?.['projectName']) {
        this.breadcrumbs[this.breadcrumbs.length - 1] = {
          label: data['projectName'],
          route: undefined,
        };
      }

      this.buildBreadcrumbs(child, url);
    }
  }
  private formatLabel(segment: string, parentSegment?: string): string {
    if (segment === 'add' && parentSegment) {
      const parentLabel = this.formatLabel(parentSegment);
      const singularLabel = this.singularize(parentLabel);
      return `Add New ${singularLabel}`;
    }

    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private singularize(word: string): string {
    if (word.endsWith('ies')) {
      return word.slice(0, -3) + 'y';
    }
    if (word.endsWith('s')) {
      return word.slice(0, -1);
    }
    return word;
  }

  goBack() {
    if (this.breadcrumbs.length > 1) {
      const parentBreadcrumb = this.breadcrumbs[this.breadcrumbs.length - 2];
      if (parentBreadcrumb.route) {
        this.router.navigateByUrl(parentBreadcrumb.route);
      }
    }
  }

  navigateToBreadcrumb(route?: string) {
    if (route) {
      this.router.navigateByUrl(route);
    }
  }
}
