import { Project } from './../../features/projects/models/projects.interface';
import {
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CardTotalComponent } from '../../shared/components/card-total/card-total.component';
import { ReusableTableComponent } from '../../shared/components/reusable-table/reusable-table.component';
import { DashboardService } from '../../services/dashboard.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    CardTotalComponent,
    ReusableTableComponent,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild(ReusableTableComponent)
  reusableTableComponent!: ReusableTableComponent<Project>;
  private dashboardService = inject(DashboardService);
  private service = inject(ProjectsService);
  private router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  ref: DynamicDialogRef | undefined;
  countriesDD: DropDownOption[] = [];
  citiesDD: DropDownOption[] = [];
  selectedItems: Project[] = [];
  userName =
    JSON.parse(localStorage.getItem('user') || '{}')?.username ??
    this.translate.instant('user_menu.admin_name');

  cards: any[] = [];

  emptyStateInfo = {
    label: 'empty_state.projects.create_btn',
    description: 'empty_state.projects.no_data',
    callback: () => this.addNewProject(),
  };

  private cardConfig = [
    {
      key: 'totalProjects',
      title: 'dashboard.total_projects',
      icon: 'images/projects-icon.svg',
    },
    {
      key: 'totalClients',
      title: 'dashboard.total_clients',
      icon: 'images/clients-icon.svg',
    },
    {
      key: 'totalServices',
      title: 'dashboard.total_services',
      icon: 'images/services-icon.svg',
    },
    {
      key: 'totalTestimonials',
      title: 'dashboard.total_testimonials',
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
      header: 'projects.list.table_headers.project',
      type: 'avatar-and-name',
      avatarField: 'image',
    },
    {
      field: 'countryName',
      header: 'projects.list.table_headers.country',
      type: 'text',
    },
    {
      field: 'cityName',
      header: 'projects.list.table_headers.city',
      type: 'text',
    },
    {
      field: 'services',
      header: 'projects.list.table_headers.services',
      type: 'chips-group',
    },
    {
      field: 'localeComplete',
      header: 'projects.list.table_headers.locale',
      type: 'languages-chips',
    },
    {
      field: 'status',
      header: 'projects.list.table_headers.status',
      type: 'status',

      statusCallback: (row: Project, value: boolean, e: Event) =>
        this.changeStatus(row, value, e),
    },
  ];

  actions: TableAction<Project>[] = [
    {
      severity: 'white',
      callback: (row) => this.router.navigate([`/projects/edit/${row.id}`]),
      class: 'padding-action-btn',
    },
    {
      callback: (row, event) => this.delete(row, event),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'padding-action-btn',
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
      placeholder: 'general.search_input_table_placeholder',
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
      anmSeverity: 'expand',
      btnCallback: (e: Event) => this.viewAllProjects(),
    },
  ];

  ngOnInit(): void {
    this.initFilterConfig();
    this.getStats();
    this.getDropDowns();
    this.fetchProjects(this.paginationObj);

    this.translate.onLangChange.subscribe(() => {
      this.fetchProjects(this.paginationObj);
    });
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
    this.service
      .getAll(pagination, this.filterObj?.key || '', this.filterObj)
      .subscribe({
        next: (res) => {
          // this.data.set(res.result);
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
      countries: this.service.getCountries(),
      cities: this.service.getAllCities(),
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
        name: 'value',
        placeholder: 'general.search_input_table_placeholder',
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
        anmSeverity: 'expand-gap',
        btnCallback: (e: Event) => this.viewAllProjects(),
      },
    ];
  }
  delete(row: Project, event?: Event) {
    console.log('Delete action triggered', row, event);
    this.showDeleteConfirmDialog(row, 'delete');
  }
  showDeleteConfirmDialog(
    dataToDelete: Project | Project[],
    actionType: 'delete' | 'bulk-delete' = 'delete',
  ) {
    const header =
      actionType === 'delete'
        ? 'projects.list.delete_dialog.header'
        : this.translate.instant('projects.list.bulk_delete_dialog.header');
    const count = Array.isArray(dataToDelete) ? dataToDelete.length : 0;
    const desc =
      actionType === 'delete'
        ? 'projects.list.delete_dialog.desc'
        : this.translate.instant('projects.list.bulk_delete_dialog.desc', {
            count,
          });
    const data = dataToDelete;
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      width: '40vw',
      modal: true,
      data: {
        title: header,
        subtitle: desc,
        confirmText: 'general.delete',
        cancelText: 'general.cancel',
        icon: 'images/delete.svg',
        confirmSeverity: 'delete',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: data,
      },
    });
    this.ref.onClose.subscribe(
      (product: { action: string; data: Project | Project[] }) => {
        if (product && product.action === 'confirm') {
          if (!Array.isArray(product.data)) {
            this.service.delete(product.data.id).subscribe({
              next: () => {
                this.fetchProjects(this.paginationObj);
              },
            });
          } else {
            const ids = product.data.map((a: Project) => a.id);
            this.service.bulkDelete(ids).subscribe((_) => {
              this.fetchProjects(this.paginationObj);
              this.reusableTableComponent.selection = [];
              this.selectedItems = [];
              this.addAndHideBulkDeleteBtn();
            });
          }
        }
      },
    );
  }
  addAndHideBulkDeleteBtn() {
    const hasSelection =
      Array.isArray(this.selectedItems) && this.selectedItems.length > 0;
    const bulkDeleteBtn: FilterItems = {
      label: 'general.delete_selected',
      type: 'btn',
      name: 'delete-btn',
      btnIcon: 'pi pi-trash',
      btnSeverity: 'white',
      btnCallback: () => this.bulkDelete(),
    };
    if (hasSelection) {
      const withoutBulk = this.filterItems.filter(
        (f) => f.name !== 'delete-btn',
      );
      this.filterItems = [bulkDeleteBtn, ...withoutBulk];
    } else {
      this.filterItems = this.filterItems.filter(
        (f) => f.name !== 'delete-btn',
      );
    }
  }
  bulkDelete() {
    this.showDeleteConfirmDialog(this.selectedItems, 'bulk-delete');
  }
  onFilterChange(filter: any) {
    this.filterObj = filter;
    this.fetchProjects(this.paginationObj);
  }
  addNewProject() {
    this.router.navigate(['/projects/add']);
  }
  changeStatus(row: Project, value: boolean, e: Event) {
    this.service.changeStatus(row.id, value).subscribe();
  }
  selectionChange(e: Project[] | Project) {
    this.selectedItems = Array.isArray(e) ? e : [e];
    this.addAndHideBulkDeleteBtn();
  }
}
