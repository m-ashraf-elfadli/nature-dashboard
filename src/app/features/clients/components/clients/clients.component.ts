import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ReusableTableComponent } from "../../../../shared/components/reusable-table/reusable-table.component";
import { TableAction, TableColumn, TableConfig } from '../../../../shared/components/reusable-table/reusable-table.types';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ClientFormComponent } from "../client-form/client-form.component";
import { PaginationObj } from '../../../../core/models/global.interface';
import { ClientsService } from '../../services/clients.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent, ConfirmationDialogConfig } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Client, ClientFormEvent } from '../../models/clients.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReusableTableComponent,
    DialogModule,
    ButtonModule,
    ClientFormComponent,
    TranslateModule
  ],
  providers: [DialogService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  @ViewChild(ClientFormComponent) clientForm?: ClientFormComponent;

  private clientsService = inject(ClientsService);
  private dialogService = inject(DialogService);

  visible = false;
  data: Client[] = [];
  totalRecords = 0;
  currentClientId?: string;
  confirmDialogRef?: DynamicDialogRef;

  paginationObj: PaginationObj = {
    page: 1,
    size: 10,
  };

  ngOnInit() {
    this.loadClients();
  }

  loadClients(pagination?: PaginationObj) {
    const pag = pagination || this.paginationObj;

    this.clientsService.getAll(pag, '').subscribe({
      next: (res) => {
        this.data = res.result || [];
        this.totalRecords = res.total || 0;
      },
      error: (err) => {
        console.error('Clients fetch error:', err);
      }
    });
  }

  columns: TableColumn<Client>[] = [
    {
      field: 'name',
      header: 'clients.list.table_headers.name',
      type: 'text'
    },
    {
      field: 'image',
      header: 'clients.list.table_headers.image',
      type: 'image'
    },
    {
      field: 'createdAt',
      header: 'general.date_added',
      type: 'date'
    },
    {
      field: 'status',
      header: 'clients.list.table_headers.status',
      type: 'status'
    },
  ];

  actions: TableAction<Client>[] = [
    {
      callback: (row) => this.edit(row),
      icon: 'pi pi-pencil',
      severity: 'white',
      class: 'p-2'
    },
    {
      callback: (row) => this.delete(row),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'p-2'
    }
  ];

  config: TableConfig<Client> = {
    columns: this.columns,
    serverSidePagination: true,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true
  };

  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'key',
      placeholder: 'general.search_input_table_placeholder'
    },
    {
      type: 'btn',
      label: 'general.import',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      btnCallback: () => this.importCSV()
    },
    {
      type: 'btn',
      label: 'clients.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      btnCallback: () => this.showDialog()
    }
  ];

  showDialog() {
    this.currentClientId = undefined;
    this.visible = true;
  }

  edit(row: Client) {
    this.currentClientId = row.id;
    this.visible = true;
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
      data: row
    };

    this.confirmDialogRef = this.dialogService.open(ConfirmDialogComponent, {
      modal: true,
      data: dialogConfig,
      header: '',
      width: '505px',
      closable: false,
      styleClass: 'confirm-dialog'
    });

    this.confirmDialogRef.onClose.subscribe((result: any) => {
      if (result?.action === 'confirm' && result.data?.id) {
        this.performDelete(result.data.id);
      }
    });
  }

  private performDelete(id: string) {
    this.clientsService.delete(id).subscribe({
      next: () => this.loadClients(),
      error: () => alert('Failed to delete client')
    });
  }

  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.loadClients(event);
  }

  selectionChange(e: Client[] | Client) {
    console.log('Selected:', e);
  }

  importCSV() {
    console.log('Import CSV');
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

  private handleSave(formData: FormData) {
    if (this.currentClientId) {
      this.clientsService.update(this.currentClientId, formData).subscribe({
        next: () => {
          this.visible = false;
          this.currentClientId = undefined;
          this.loadClients();
        }
      });
    } else {
      this.clientsService.create(formData).subscribe({
        next: () => {
          this.visible = false;
          this.loadClients();
        }
      });
    }
  }

  private handleSaveAndCreateNew(formData: FormData) {
    this.clientsService.create(formData).subscribe({
      next: () => {
        this.loadClients();
        this.currentClientId = undefined;
        this.clientForm?.resetForm();
      }
    });
  }

  private handleCancel() {
    this.visible = false;
    this.currentClientId = undefined;
  }

  onDialogHide() {
    this.currentClientId = undefined;
  }

  ngOnDestroy() {
    this.confirmDialogRef?.close();
  }
}
