import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, filter } from 'rxjs';
import { ProjectsService } from '../../../features/projects/services/projects.service';
import { ServicesService } from '../../../services/services.service';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  isTranslationKey?: boolean; // Flag to know if we should translate
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly projectsService = inject(ProjectsService);
  private readonly servicesService = inject(ServicesService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);

  @Input() title: string = '';
  breadcrumbs: BreadcrumbItem[] = [];

  private destroy$ = new Subject<void>();
  private currentEntityId: string | null = null;
  private currentEntityType: 'project' | 'service' | null = null;

  ngOnInit() {
    this.updateBreadcrumbs();

    // Update breadcrumbs on navigation
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
    // Update breadcrumbs on language change
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateBreadcrumbs(): void {
    this.breadcrumbs = [
      {
        label: 'breadcrumb.dashboard',
        route: '/dashboard',
        isTranslationKey: true,
      },
    ];

    this.buildBreadcrumbs(this.route.root);
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '') {
    for (const child of route.children) {
      const segment = child.snapshot.url.map((s) => s.path).join('/');

      if (segment) {
        url += `/${segment}`;
      }

      const data = child.snapshot.data;
      const params = child.snapshot.paramMap;

      // Add breadcrumb if there's a breadcrumb key in route data
      if (data?.['breadcrumb'] && segment) {
        this.breadcrumbs.push({
          label: data['breadcrumb'],
          route: url,
          isTranslationKey: true,
        });
      }

      // Handle dynamic entity names (projects, services, etc.)
      const entityId = params.get('id');

      if (entityId) {
        // Detect entity type from URL
        if (url.includes('/projects/')) {
          this.currentEntityType = 'project';
          this.currentEntityId = entityId;
          this.fetchProjectName(entityId);
        } else if (url.includes('/services/')) {
          this.currentEntityType = 'service';
          this.currentEntityId = entityId;
          this.fetchServiceName(entityId);
        }
      }

      // Handle resolved values from route data (backward compatibility)
      if (data?.['projectName']) {
        this.updateLastBreadcrumb(data['projectName']);
      }
      if (data?.['serviceName']) {
        this.updateLastBreadcrumb(data['serviceName']);
      }

      if (data?.['awardName']) {
        this.breadcrumbs[this.breadcrumbs.length] = {
          label: data['awardName'],
          route: undefined,
        };
      }

      this.buildBreadcrumbs(child, url);
    }
  }

  private fetchProjectName(id: string): void {
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang || 'en';

    this.projectsService
      .getById(id, currentLang)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.updateLastBreadcrumb(res.result.name);
        },
        error: (err) => {
          console.error('Failed to fetch project name', err);
        },
      });
  }

  private fetchServiceName(id: string): void {
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang || 'en';

    this.servicesService
      .getServiceById(id, currentLang)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.updateLastBreadcrumb(res.result.name);
        },
        error: (err) => {
          console.error('Failed to fetch service name', err);
        },
      });
  }

  private updateLastBreadcrumb(name: string): void {
    if (this.breadcrumbs.length > 0) {
      const lastIndex = this.breadcrumbs.length - 1;
      this.breadcrumbs[lastIndex] = {
        label: name,
        route: undefined,
        isTranslationKey: false, // This is a resolved name, not a key
      };
      // Trigger change detection
      this.breadcrumbs = [...this.breadcrumbs];
    }
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

  // Helper method to get translated or raw label
  getBreadcrumbLabel(item: BreadcrumbItem): string {
    if (item.isTranslationKey) {
      return this.translate.instant(item.label);
    }
    return item.label;
  }
}
