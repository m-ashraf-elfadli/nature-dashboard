import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { FilterItems } from '../../shared/components/filters/filters.component';
import {
  TableColumn,
  TableAction,
  TableConfig,
} from '../../shared/components/reusable-table/reusable-table.types';
import { ReusableTableComponent } from '../../shared/components/reusable-table/reusable-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesService } from '../../services/services.service';
import {
  LocaleComplete,
  Project,
} from '../../features/projects/models/projects.interface';
import { PaginationObj } from '../../core/models/global.interface';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppDialogService } from '../../shared/services/dialog.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

export interface Service {
  id: string;
  name: string;
  tagline: string;
  status: boolean;
  localeComplete: LocaleComplete;
  createdAt: string;
  updatedAt: string;
}
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ReusableTableComponent,
    TranslateModule,
    EmptyStateComponent,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  providers: [AppDialogService],
})
export class ServicesComponent {
  private router = inject(Router);
  private service = inject(ServicesService);
  private dialogService = inject(AppDialogService);

  data: WritableSignal<Service[]> = signal([]);
  totalRecords: WritableSignal<number> = signal(0);

  paginationObj: PaginationObj = {
    page: 1,
    size: 10,
  };
  filterObj: any;

  ref: DynamicDialogRef | undefined;

  emptyStateDescription: string =
    'No Data to preview, start create your first service to appear here!';
  emptyStateBtnLabel: string = `Create New Service`;
  columns: TableColumn<any>[] = [
    {
      field: 'name',
      header: 'Service',
      type: 'text',
    },
    {
      field: 'tagline',
      header: 'Description',
      type: 'text',
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
    },
  ];

  actions: TableAction<Service>[] = [
    {
      callback: (row) => this.edit(row),
      icon: 'pi pi-pencil',
      severity: 'white',
      class: 'p-2',
    },
    {
      callback: (row) => this.delete(row),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'p-2',
    },
  ];

  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'key',
      placeholder: 'Search by name ...',
    },
    {
      type: 'btn',
      label: 'Import CSV',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
    },
    {
      type: 'btn',
      label: 'services.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      btnCallback: (e: Event) => this.addNew(),
    },
  ];
  config: TableConfig<Service> = {
    columns: this.columns,
    serverSidePagination: true,
    serverSideFilter: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
  };

  ngOnInit() {
    this.fetchData(this.paginationObj);
  }

  fetchData(pagination: PaginationObj) {
    this.service.getAll(pagination, this.filterObj?.key || '').subscribe({
      next: (res) => {
        this.data.set(res.result);
        this.totalRecords.set(res.total!);
      },
      error: (err) => {
        console.error('Failed to load projects', err);
      },
    });
  }
  onFilterChange(filter: any) {
    this.filterObj = filter;
    this.fetchData(this.paginationObj);
  }
  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.fetchData(this.paginationObj);
  }
  selectionChange(e: Service[] | Service) {
    console.log('selected items', e);
  }
  addNewService(e: Event) {
    console.log('Add New Service button clicked', e);
  }
  addNew() {
    this.router.navigate(['/services/add']);
  }
  edit(row: any) {
    this.router.navigate(['/services/edit', row.id]);
  }
  delete(row: Service, event?: Event) {
    this.showConfirmDialog(row);
  }
  showConfirmDialog(row: Service) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      width: '40vw',
      modal: true,
      data: {
        title: 'services.list.delete_dialog.header',
        subtitle: 'services.list.delete_dialog.desc',
        confirmText: 'general.delete',
        cancelText: 'general.cancel',
        confirmSeverity: 'delete',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: row,
      },
    });
    this.ref.onClose.subscribe((product: { action: string; data: Service }) => {
      if (product) {
        if (product.action === 'confirm') {
          this.service.delete(product.data.id).subscribe({
            next: () => {
              this.fetchData(this.paginationObj);
            },
          });
        }
      }
    });
  }
}
