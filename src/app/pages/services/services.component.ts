import { Component, inject } from '@angular/core';
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
import { Project } from '../../features/projects/components/projects/projects.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppDialogService } from '../../shared/services/dialog.service';

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
  private router = inject(Router);
  private servicesService = inject(ServicesService);
  private dialogService = inject(AppDialogService);

  data: any[] = [];
  totalRecords = this.data.length;

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

  actions: TableAction<Project>[] = [
    {
      callback: (row) => this.edit(row),
      icon: 'pi pi-pencil',
      severity: 'white',
      class: 'p-2',
    },
    {
      callback: (row) => this.showDeleteConfirmationPopup(row),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'p-2',
    },
  ];
  edit(row: any) {
    this.router.navigate(['/services/edit', row.id]);
  }
  delete(id: string) {
    this.servicesService.deleteService(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllServices();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'keyword',
      placeholder: 'Search by name ...',
    },
    // {
    //   type: 'filter',
    //   btnIcon:"pi pi-download",
    //   btnSeverity:"white",
    // },
    {
      type: 'btn',
      label: 'Import CSV',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      btnCallback: (e: Event) => this.addNewService(e),
    },
    {
      type: 'btn',
      label: 'services.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      btnCallback: (e: Event) => this.addNew(),
    },
  ];
  config: TableConfig<Project> = {
    columns: this.columns,
    serverSidePagination: false,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
  };

  ngOnInit() {
    this.getAllServices();
  }

  onAction(event: { action: string; row: Project }) {
    console.log('Action clicked:', event);
  }

  onPaginationChange(event: { page: number; perPage: number }) {
    console.log('Pagination changed:', event);
  }
  selectionChange(e: Project[] | Project) {
    console.log('selected items', e);
  }
  addNewService(e: Event) {
    console.log('Add New Service button clicked', e);
  }
  addNew() {
    this.router.navigate(['/services/add']);
  }
  getAllServices() {
    this.servicesService.getAllServices().subscribe({
      next: (res: any) => {
        this.data = res.result;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  showDeleteConfirmationPopup(row: any): void {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Delete Confirmation',
      width: '500px',
      data: {
        title: 'Delete Service?',
        subtitle:
          'Are you sure want to delete this service? This action can’t be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmSeverity: 'delete',
        cancelSeverity: 'cancel',
        showCancel: true,
      },
    });

    ref.onClose.subscribe((result: any) => {
      if (!result) {
        return;
      }

      if (result.action === 'confirm') {
        this.delete(row?.id);
      }
    });
  }
}
