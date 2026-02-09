import { Component, OnInit, inject, ViewChild, OnDestroy } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from '../../../../shared/components/reusable-table/reusable-table.component';
import {
  TableAction,
  TableColumn,
  TableConfig,
} from '../../../../shared/components/reusable-table/reusable-table.types';
import { ButtonModule } from 'primeng/button';
import { ClientFormComponent } from '../client-form/client-form.component';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { ClientsService } from '../../services/clients.service';
import {
  ConfirmDialogComponent,
  ConfirmationDialogConfig,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginationObj } from '../../../../core/models/global.interface';
import {
  Client,
  ClientFormActions,
  ClientFormEvent,
} from '../../models/clients.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReusableTableComponent,
    ButtonModule,
    ClientFormComponent,
    TranslateModule,
    DialogModule,
  ],
  providers: [DialogService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit, OnDestroy {
  private readonly service = inject(ClientsService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);

  @ViewChild(ClientFormComponent)
  clientForm?: ClientFormComponent;
  @ViewChild(ReusableTableComponent) reusableTableComponent!: ReusableTableComponent<Client>;

  visible = false;
  data: Client[] = [];
  totalRecords = 0;
  selectedItems: Client[] = [];

  currentClientId?: string;
  confirmDialogRef?: DynamicDialogRef;

  paginationObj: PaginationObj = { page: 1, size: 10 };
  filterObj: any;

  emptyStateInfo = {
    label: 'empty_state.clients.create_btn',
    description: 'empty_state.clients.no_data',
    callback: () => this.showDialog(),
  };

  ngOnInit() {
    this.loadClients();
  }

  ngOnDestroy() {
    this.confirmDialogRef?.close();
  }

  loadClients(pagination?: PaginationObj) {
    const pag = pagination || this.paginationObj;

    this.service.getAll(pag, this.filterObj?.key || '').subscribe({
      next: (res) => {
        this.data = res.result || [];
        this.totalRecords = res.total || 0;
      },
      error: (err) => console.error('Clients fetch error:', err),
    });
  }

  columns: TableColumn<Client>[] = [
    {
      field: 'name',
      header: 'clients.list.table_headers.name',
      type: 'text',
    },
    {
      field: 'image',
      header: 'clients.list.table_headers.image',
      type: 'image',
    },
    {
      field: 'createdAt',
      header: 'general.date_added',
      type: 'date',
    },
    {
      field: 'status',
      header: 'clients.list.table_headers.status',
      type: 'status',
      statusCallback: (row, value, e) =>
        this.changeStatus(row, value, e),
    },
  ];

  actions: TableAction<Client>[] = [
    {
      icon: 'pi pi-pencil',
      callback: (row) => this.edit(row),
      severity: 'white',
      class: 'padding-action-btn',
    },
    {
      icon: 'pi pi-trash',
      callback: (row) => this.delete(row),
      severity: 'white',
      class: 'padding-action-btn',
    },
  ];

  config: TableConfig<Client> = {
    columns: this.columns,
    serverSidePagination: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideFilter: true,
  };

  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'key',
      placeholder: 'general.search_input_table_placeholder',
    },
    {
      type: 'btn',
      label: 'clients.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      btnCallback: () => this.showDialog(),
    },
    {
      type: 'btn',
      label: 'general.import',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      btnCallback: () => this.importCSV(),
    },
  ];

  showDialog() {
    this.currentClientId = undefined;
    this.visible = true;
  }

  edit(row: Client) {
    this.currentClientId = row.id;
    this.visible = true;
  }

  onDialogHide() {
    this.currentClientId = undefined;
  }

  delete(row: Client) {
    this.showDeleteConfirmDialog(row, 'delete');
  }

  bulkDelete() {
    this.showDeleteConfirmDialog(this.selectedItems, 'bulk-delete');
  }

  selectionChange(e: Client[] | Client) {
    this.selectedItems = Array.isArray(e) ? e : [e];
    this.addAndHideBulkDeleteBtn();
  }

  addAndHideBulkDeleteBtn() {
    const hasSelection = Array.isArray(this.selectedItems) && this.selectedItems.length > 0;
    const bulkDeleteBtn: FilterItems = {
      label: 'general.delete_selected',
      type: 'btn',
      name: 'bulk-delete-btn',
      btnIcon: 'pi pi-trash',
      btnSeverity: 'white',
      btnCallback: () => this.bulkDelete(),
    };
    if (hasSelection) {
      const withoutBulk = this.filterItems.filter((f) => f.name !== 'bulk-delete-btn');
      this.filterItems = [bulkDeleteBtn, ...withoutBulk];
    } else {
      this.filterItems = this.filterItems.filter((f) => f.name !== 'bulk-delete-btn');
    }
  }

  showDeleteConfirmDialog(dataToDelete: Client | Client[], actionType: 'delete' | 'bulk-delete' = 'delete') {
    const header =
      actionType === 'delete'
        ? 'clients.list.delete_dialog.header'
        : this.translate.instant('clients.list.bulk_delete_dialog.header');
    const count = Array.isArray(dataToDelete) ? dataToDelete.length : 0;
    const desc =
      actionType === 'delete'
        ? 'clients.list.delete_dialog.desc'
        : this.translate.instant('clients.list.bulk_delete_dialog.desc', { count });
    const data = dataToDelete;

    this.confirmDialogRef = this.dialogService.open(ConfirmDialogComponent, {
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
        data: data,
      },
      width: '505px',
      closable: false,
      styleClass: 'confirm-dialog',
    });

    this.confirmDialogRef.onClose.subscribe((product: { action: string; data: Client | Client[] }) => {
      if (product && product.action === 'confirm') {
        if (!Array.isArray(product.data)) {
          this.performDelete(product.data.id);
        } else {
          const ids = product.data.map((c: Client) => c.id);
          this.service.bulkDelete(ids).subscribe((_) => {
            this.loadClients();
            this.reusableTableComponent.selection = [];
            this.selectedItems = [];
          });
        }
      }
    });
  }

  private performDelete(id: string) {
    this.service.delete(id).subscribe({
      next: () => this.loadClients(),
      error: (err) => console.error('Delete error:', err),
    });
  }

  changeStatus(row: Client, value: boolean, e: Event) {
    this.service.changeStatus(row.id, value).subscribe({
      next: () => this.loadClients(),
    });
  }



  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.loadClients(event);
  }

  onFilterChange(filter: any) {
    this.filterObj = filter;
    this.loadClients();
  }

  handleFormClose(event: ClientFormEvent) {
    if (event.action === 'cancel') {
      this.handleCancel();
      return;
    }

    this.submitForm(
      event.formData,
      !!this.currentClientId,
      event.action
    );
  }

  submitForm(
    payload: FormData,
    isEditMode: boolean,
    action: ClientFormActions
  ) {
    const request$ = isEditMode
      ? this.service.update(this.currentClientId!, payload)
      : this.service.create(payload);

    request$.subscribe({
      next: () => {
        // close dialog only on save
        if (action === 'save') {
          this.visible = false;
        }

        // reset after success only
        this.currentClientId = undefined;
        this.clientForm?.resetForm();

        this.loadClients();
      },
      error: (err) => {
        console.error(
          `❌ ${isEditMode ? 'Update' : 'Create'} error:`,
          err
        );
      },
    });
  }

  private handleCancel() {
    this.visible = false;
    this.currentClientId = undefined;
  }

  importCSV() {
    console.log('Import CSV');
  }
}
