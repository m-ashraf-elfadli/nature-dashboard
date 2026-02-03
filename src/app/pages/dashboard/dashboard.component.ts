import { Project } from './../../features/projects/models/projects.interface';
import {
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CardTotalComponent } from '../../shared/components/card-total/card-total.component';
import { ReusableTableComponent } from '../../shared/components/reusable-table/reusable-table.component';
import { DashboardService } from '../../services/dashboard.service';

import {
  TableAction,
  TableColumn,
  TableConfig,
} from '../../shared/components/reusable-table/reusable-table.types';

import {
  DropDownOption,
  PaginationObj,
} from '../../core/models/global.interface';
import { FilterItems } from '../../shared/components/filters/filters.component';
import { ProjectsService } from '../../features/projects/services/projects.service';
import { forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    CardTotalComponent,
    ReusableTableComponent,
    EmptyStateComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private readonly dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;
  countriesDD: DropDownOption[] = [];
  citiesDD: DropDownOption[] = [];

  userName =
    JSON.parse(localStorage.getItem('user') || '{}')?.username ??
    'Nature Admin';

  cards: any[] = [];

  emptyStateInfo = {
    label: 'Create New Project',
    description:
      'No Date to preview, start create your first project to appear here!',
    callback: () => this.addNewProject(),
  };

  private cardConfig = [
    {
      key: 'totalProjects',
      title: 'Total Projects',
      icon: 'images/projects-icon.svg',
    },
    {
      key: 'totalClients',
      title: 'Total Clients',
      icon: 'images/clients-icon.svg',
    },
    {
      key: 'totalServices',
      title: 'Total Services',
      icon: 'images/services-icon.svg',
    },
    {
      key: 'totalTestimonials',
      title: 'Testimonials',
      icon: 'images/testImonials-icon.svg',
    },
  ] as const;

  /* ===================== TABLE ===================== */
  data: WritableSignal<Project[]> = signal([]);
  totalRecords = signal(0);

  paginationObj: PaginationObj = {
    page: 1,
    size: 5,
  };

  columns: TableColumn<Project>[] = [
    {
      field: 'name',
      header: 'Project',
      type: 'avatar-and-name',
      avatarField: 'image',
    },
    {
      field: 'countryName',
      header: 'Country',
      type: 'text',
    },
    {
      field: 'cityName',
      header: 'City',
      type: 'text',
    },
    {
      field: 'status',
      header: 'Status',
      type: 'status',
    },
  ];

  actions: TableAction<Project>[] = [
    {
      icon: 'pi pi-pencil',
      severity: 'white',
      callback: (row) => this.router.navigate([`/projects/edit/${row.id}`]),
    },
    {
      callback: (row, event) => this.delete(row, event),
      icon: 'pi pi-trash',
      severity: 'white',
    },
  ];

  config: TableConfig<Project> = {
    columns: this.columns,
    rowsPerPage: 10,
    serverSidePagination: true,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
    serverSideFilter: true,
  };
  filterObj: any;

  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'value',
      placeholder: 'Search projects...',
    },
    {
      type: 'filter',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      filterOptions: [
        {
          type: 'select',
          multiple: true,
          label: 'projects.list.filter.country',
          inputName: 'country_ids',
          options: this.countriesDD,
        },
        {
          type: 'select',
          multiple: true,
          label: 'projects.list.filter.city',
          inputName: 'city_ids',
          options: this.citiesDD,
        },
      ],
    },
    {
      type: 'btn',
      label: 'projects.list.btns.view_all',
      btnSeverity: 'primary',
      btnCallback: (e: Event) => this.viewAllProjects(),
    },
  ];

  ngOnInit(): void {
    this.getStats();
    this.getDropDowns();
    this.fetchProjects(this.paginationObj);
  }
  viewAllProjects() {
    this.router.navigate(['/projects']);
  }
  /* ===================== API ===================== */
  getStats() {
    this.dashboardService.getDashboardStatistics().subscribe({
      next: (res) => {
        const stats = res.result;
        this.cards = this.cardConfig.map((c) => ({
          title: c.title,
          icon: c.icon,
          count: stats[c.key],
        }));
      },
    });
  }

  fetchProjects(pagination: PaginationObj) {
    this.projectsService
      .getAll(pagination, this.filterObj?.key || '', this.filterObj)
      .subscribe({
        next: (res) => {
          this.data.set(res.result);
          this.totalRecords.set(res.total!);
        },
      });
  }

  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.fetchProjects(event);
  }
  getDropDowns() {
    forkJoin({
      countries: this.projectsService.getCountries(),
      cities: this.projectsService.getAllCities(),
    }).subscribe({
      next: (res) => {
        this.countriesDD = res.countries.result;
        this.citiesDD = res.cities.result;
        this.initFilterConfig();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  initFilterConfig() {
    this.filterItems = [
      {
        type: 'search',
        name: 'name',
        placeholder: 'Search projects...',
      },
      {
        type: 'filter',
        btnIcon: 'pi pi-download',
        btnSeverity: 'white',
        filterOptions: [
          {
            type: 'select',
            multiple: true,
            label: 'projects.list.filter.country',
            inputName: 'country_ids',
            options: this.countriesDD,
          },
          {
            type: 'select',
            multiple: true,
            label: 'projects.list.filter.city',
            inputName: 'city_ids',
            options: this.citiesDD,
          },
        ],
      },
      {
        type: 'btn',
        label: 'projects.list.btns.view_all',
        btnSeverity: 'primary',
        btnCallback: (e: Event) => this.viewAllProjects(),
      },
    ];
  }
  delete(row: Project, event?: Event) {
    console.log('Delete action triggered', row, event);
    this.showConfirmDialog(row);
  }
  showConfirmDialog(row: Project) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Select a Product',
      width: '40vw',
      modal: true,
      data: {
        title: 'projects.list.delete_dialog.header',
        subtitle: 'projects.list.delete_dialog.desc',
        confirmText: 'general.delete',
        cancelText: 'general.cancel',
        confirmSeverity: 'delete',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: row,
      },
    });
    this.ref.onClose.subscribe((product: { action: string; data: Project }) => {
      if (product) {
        if (product.action === 'confirm') {
          this.projectsService.delete(product.data.id).subscribe({
            next: () => {
              this.fetchProjects(this.paginationObj);
            },
          });
        }
      }
    });
  }
  onFilterChange(filter: any) {
    this.filterObj = filter;
    this.fetchProjects(this.paginationObj);

    console.log(filter);
  }
  addNewProject() {
    this.router.navigate(['/projects/add']);
  }
}
