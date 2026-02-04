import { Component, OnInit, inject, ViewChild, OnDestroy } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from '../../../../shared/components/reusable-table/reusable-table.component';
import { TableAction, TableColumn, TableConfig, } from '../../../../shared/components/reusable-table/reusable-table.types';
import { ButtonModule } from 'primeng/button';
import { ClientFormComponent } from '../client-form/client-form.component';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { ClientsService } from '../../services/clients.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent, ConfirmationDialogConfig, } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationObj } from '../../../../core/models/global.interface';
import { Client, ClientFormEvent } from '../../models/clients.model';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [PageHeaderComponent, ReusableTableComponent, ButtonModule, ClientFormComponent, TranslateModule, DialogModule,],
  providers: [DialogService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit, OnDestroy {
  @ViewChild(ClientFormComponent)
  clientForm?: ClientFormComponent;
  private clientsService = inject(ClientsService);
  private dialogService = inject(DialogService);
  visible = false;
  data: Client[] = [];
  totalRecords = 0;
  currentClientId?: string;
  confirmDialogRef?: DynamicDialogRef;
  paginationObj: PaginationObj = { page: 1, size: 10, };
  filterObj: any;
  emptyStateInfo = {
    label: 'Create New Client',
    description: 'No Data to preview, start create your first client to appear here!',
    callback: () => this.showDialog(),
  };

  ngOnInit() {
    this.loadClients();
  }

  loadClients(pagination?: PaginationObj) {
    const pag = pagination || this.paginationObj;

    this.clientsService.getAll(pag, this.filterObj?.key || '').subscribe({
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
    },
  ];

  actions: TableAction<Client>[] = [
    {
      icon: 'pi pi-pencil',
      callback: (row) => this.edit(row),
      severity: 'white',
      class: 'p-2',
    },
    {
      icon: 'pi pi-trash',
      callback: (row) => this.delete(row),
      severity: 'white',
      class: 'p-2',
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
    const dialogConfig: ConfirmationDialogConfig<Client> = {
      title: 'clients.confirm.delete_title',
      subtitle: 'clients.confirm.delete_subtitle',
      icon: 'images/delete.svg',
      confirmText: 'general.delete',
      cancelText: 'general.cancel',
      confirmSeverity: 'delete',
      cancelSeverity: 'cancel',
      data: row,
    };

    this.confirmDialogRef = this.dialogService.open(
      ConfirmDialogComponent,
      {
        modal: true,
        data: dialogConfig,
        width: '505px',
        closable: false,
        styleClass: 'confirm-dialog',
      }
    );

    this.confirmDialogRef.onClose.subscribe((result: any) => {
      if (result?.action === 'confirm' && result.data?.id) {
        this.performDelete(result.data.id);
      }
    });
  }

  private performDelete(id: string) {
    this.clientsService.delete(id).subscribe({
      next: () => this.loadClients(),
      error: (err) => {
        console.error('Delete error:', err);
        alert('Failed to delete client');
      },
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
    switch (event.action) {
      case 'save':
        this.handleSave(event.formData);
        break;

      case 'saveAndCreateNew':
        this.handleSaveAndCreateNew(event.formData);
        break;

      case 'cancel':
        this.handleCancel();
        break;
    }
  }

  private handleSave(payload: FormData) {
    if (this.currentClientId) {
      this.clientsService.update(this.currentClientId, payload).subscribe({
        next: () => {
          this.visible = false;
          this.currentClientId = undefined;
          this.loadClients();
        },
        error: (err) => this.showErrorMessage(err),
      });
    } else {
      this.clientsService.create(payload).subscribe({
        next: () => {
          this.visible = false;
          this.loadClients();
        },
        error: (err) => this.showErrorMessage(err),
      });
    }
  }

  private handleSaveAndCreateNew(payload: FormData) {
    this.clientsService.create(payload).subscribe({
      next: () => {
        this.loadClients();
        this.currentClientId = undefined;
        this.clientForm?.resetForm();
      },
      error: (err) => this.showErrorMessage(err),
    });
  }

  private handleCancel() {
    this.visible = false;
    this.currentClientId = undefined;
  }

  private showErrorMessage(err: any) {
    let errorMessage = 'An error occurred';

    if (err?.error) {
      if (err.error.errors) {
        errorMessage = Object.keys(err.error.errors)
          .map(
            (key) =>
              `${key}: ${Array.isArray(err.error.errors[key])
                ? err.error.errors[key].join(', ')
                : err.error.errors[key]
              }`
          )
          .join('\n');
      } else if (err.error.message) {
        errorMessage = err.error.message;
      }
    }

    alert(`Failed to save client:\n${errorMessage}`);
  }
  importCSV() {
    console.log('Import CSV');
  }

  ngOnDestroy() {
    this.confirmDialogRef?.close();
  }
}
