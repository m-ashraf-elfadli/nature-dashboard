import {
  Component,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ServicesService } from '../../services/services.service';
import { LocaleComplete } from '../../features/projects/models/projects.interface';
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
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  providers: [AppDialogService],
})
export class ServicesComponent {
  @ViewChild(ReusableTableComponent)
  reusableTableComponent!: ReusableTableComponent<Service>;
  private router = inject(Router);
  private service = inject(ServicesService);
  private dialogService = inject(AppDialogService);
  private readonly translate = inject(TranslateService);

  data: WritableSignal<Service[]> = signal([]);
  selectedItems: Service[] = [];
  totalRecords: WritableSignal<number> = signal(0);

  paginationObj: PaginationObj = {
    page: 1,
    size: 10,
  };
  filterObj: any;

  ref: DynamicDialogRef | undefined;

  emptyStateInfo = {
    label: 'empty_state.services.create_btn',
    description: 'empty_state.services.no_data',
    callback: () => this.addNew(),
  };
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
      statusCallback: (row: Service, value: boolean, e: Event) =>
        this.changeStatus(row, value, e),
    },
  ];

  actions: TableAction<Service>[] = [
    {
      callback: (row) => this.edit(row),
      severity: 'white',
      class: 'padding-action-btn',
    },
    {
      callback: (row) => this.delete(row),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'padding-action-btn',
    },
  ];

  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'key',
      placeholder: 'general.search_input_table_placeholder',
    },
    {
      type: 'btn',
      label: 'general.import',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      anmSeverity: 'bg-grow',
    },
    {
      type: 'btn',
      label: 'services.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      anmSeverity: 'expand-gap',
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

    this.translate.onLangChange.subscribe(() => {
      this.fetchData(this.paginationObj);
    });
  }

  fetchData(pagination: PaginationObj) {
    this.service.getAll(pagination, this.filterObj?.key || '').subscribe({
      next: (res) => {
        this.data.set(res.result);
        this.totalRecords.set(res.total!);
      },
      error: (err) => {
        console.error('Failed to load services', err);
      },
    });
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
  onFilterChange(filter: any) {
    this.filterObj = filter;
    this.fetchData(this.paginationObj);
  }
  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.fetchData(this.paginationObj);
  }
  selectionChange(e: Service[] | Service) {
    this.selectedItems = Array.isArray(e) ? e : [e];
    this.addAndHideBulkDeleteBtn();
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
    this.showDeleteConfirmDialog(row, 'delete');
  }
  bulkDelete() {
    this.showDeleteConfirmDialog(this.selectedItems, 'bulk-delete');
  }
  showDeleteConfirmDialog(
    dataToDelete: Service | Service[],
    actionType: 'delete' | 'bulk-delete' = 'delete',
  ) {
    const header =
      actionType === 'delete'
        ? 'services.list.delete_dialog.header'
        : this.translate.instant('services.list.bulk_delete_dialog.header');
    const count = Array.isArray(dataToDelete) ? dataToDelete.length : 0;
    const desc =
      actionType === 'delete'
        ? 'services.list.delete_dialog.desc'
        : this.translate.instant('services.list.bulk_delete_dialog.desc', {
          count,
        });
    const data = dataToDelete;
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      width: '40vw',
      modal: true,
      data: {
        title: header,
        subtitle: desc,
        icon: 'images/delete.svg',
        confirmText: 'general.delete',
        cancelText: 'general.cancel',
        confirmSeverity: 'delete',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: data,
      },
    });
    this.ref.onClose.subscribe(
      (product: { action: string; data: Service | Service[] }) => {
        if (product && product.action === 'confirm') {
          if (!Array.isArray(product.data)) {
            this.service.delete(product.data.id).subscribe({
              next: () => {
                this.fetchData(this.paginationObj);
              },
            });
          } else {
            const ids = product.data.map((a: Service) => a.id);
            this.service.bulkDelete(ids).subscribe((_) => {
              this.fetchData(this.paginationObj);
              this.reusableTableComponent.selection = [];
              this.selectedItems = [];
            });
          }
        }
      },
    );
  }
  changeStatus(row: Service, value: boolean, e: Event) {
    this.service.changeStatus(row.id, value).subscribe();
  }
}
