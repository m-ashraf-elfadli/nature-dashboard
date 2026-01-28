import { Component, OnInit, inject } from '@angular/core';
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

export interface Client {
  id: string;
  name: string;
  image: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    PageHeaderComponent, 
    ReusableTableComponent, 
    DialogModule, 
    ButtonModule, 
    ClientFormComponent
  ],
  providers: [DialogService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {

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
    console.log('🟢 ClientsComponent initialized');
    this.loadClients();
  }

  loadClients(pagination?: PaginationObj) {
    const pag = pagination || this.paginationObj;
    console.log('🔵 Loading clients with pagination:', pag);
    
    this.clientsService.getAll(pag, '').subscribe({
      next: (res) => {
        console.log('✅ Clients loaded successfully:', res);
        this.data = res.result || [];
        this.totalRecords = res.total || 0;
      },
      error: (err) => {
        console.error('❌ Clients fetch error:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Error details:', err.error);
      }
    });
  }

  columns: TableColumn<Client>[] = [
    { field: 'name', header: 'Client name', type: 'text' },
    { field: 'image', header: 'Client image', type: 'image' },
    { field: 'createdAt', header: 'Date added', type: 'date' },
    { field: 'status', header: 'Status', type: 'status' },
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
      placeholder: 'Search by name ...'
    },
    {
      type: 'btn',
      label: "Add New Client",
      btnIcon: "pi pi-plus",
      btnSeverity: "primary",
      btnCallback: () => this.showDialog()
    },
    {
      type: 'btn',
      label: "Import CSV",
      btnIcon: "pi pi-download",
      btnSeverity: "white",
      btnCallback: () => this.importCSV()
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

  delete(row: Client) {
    console.log('Delete called with row:', row);
    
    const dialogConfig: ConfirmationDialogConfig<Client> = {
      title: 'Delete Client',
      subtitle: `Are you sure you want to delete "${row.name}"? This action cannot be undone.`,
      icon: 'images/delete.svg',
      confirmText: 'Delete',
      cancelText: 'Cancel',
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
      console.log('Dialog closed with result:', result);
      
      if (result && result.action === 'confirm' && result.data && result.data.id) {
        this.performDelete(result.data.id);
      }
    });
  }

  private performDelete(id: string) {
    console.log('Performing delete for ID:', id);
    
    this.clientsService.delete(id).subscribe({
      next: () => {
        console.log('Deleted successfully');
        this.loadClients();
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Failed to delete client');
      }
    });
  }

  onPaginationChange(event: PaginationObj) {
    console.log('📄 Pagination changed:', event);
    this.paginationObj = event;
    this.loadClients(event);
  }

  selectionChange(e: Client[] | Client) {
    console.log('✔️ Selected items:', e);
  }

  importCSV() {
    console.log("📥 Import CSV button clicked");
  }

  handleSave(payload: FormData) {
    console.log('💾 handleSave called');
    
    // Check if it's "Save and Create New"
    const createNew = payload.get('createNew') === 'true';
    payload.delete('createNew');
    
    if (this.currentClientId) {
      // Update existing
      console.log('✏️ Updating client:', this.currentClientId);
      this.clientsService.update(this.currentClientId, payload).subscribe({
        next: (res) => {
          console.log('✅ Update success:', res);
          this.visible = false;
          this.loadClients();
        },
        error: (err) => {
          console.error('❌ Update error:', err);
          this.showErrorMessage(err);
        }
      });
    } else {
      // Create new
      console.log('➕ Creating new client');
      this.clientsService.create(payload).subscribe({
        next: (res) => {
          console.log('✅ Create success:', res);
          if (createNew) {
            this.loadClients();
          } else {
            this.visible = false;
            this.loadClients();
          }
        },
        error: (err) => {
          console.error('❌ Create error:', err);
          this.showErrorMessage(err);
        }
      });
    }
  }

  private showErrorMessage(err: any) {
    let errorMessage = 'An error occurred';
    
    if (err.error) {
      if (err.error.errors) {
        const errors = err.error.errors;
        const errorMessages = Object.keys(errors).map(key => {
          return `${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`;
        });
        errorMessage = errorMessages.join('\n');
      } else if (err.error.message) {
        errorMessage = err.error.message;
      }
    }
    
    console.log('Full error message:', errorMessage);
    alert(`Failed to save client:\n${errorMessage}`);
  }

  ngOnDestroy() {
    if (this.confirmDialogRef) {
      this.confirmDialogRef.close();
    }
  }
}