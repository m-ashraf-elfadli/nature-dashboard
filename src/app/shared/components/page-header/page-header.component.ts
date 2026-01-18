import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent implements OnInit {
  @Input() title: string = '';
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.generateBreadcrumbs();
  }

  private generateBreadcrumbs() {
    const urlSegments = this.router.url.split('/').filter((segment) => segment);
    this.breadcrumbs = [];
    this.breadcrumbs.push({ label: 'Dashboard', route: '/' });

    let route = '';
    urlSegments.forEach((segment, index) => {
      route += '/' + segment;
      const label = this.formatLabel(segment, urlSegments[index - 1]);
      const isLast = index === urlSegments.length - 1;

      this.breadcrumbs.push({
        label,
        route: isLast ? undefined : route,
      });
    });
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
