import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from '../../../../shared/components/reusable-table/reusable-table.component';
import { TableAction, TableColumn, TableConfig, } from '../../../../shared/components/reusable-table/reusable-table.types';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TestimonialsFormComponent } from '../testimonials-form/testimonials-form.component';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { TestimonialsService } from '../../services/testimonials.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent, ConfirmationDialogConfig, } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationObj } from '../../../../core/models/global.interface';
import { Testimonial, TestimonialFormEvent, } from '../../models/testimonials.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientFormActions } from '../../../clients/models/clients.model';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [PageHeaderComponent, ReusableTableComponent, DialogModule, ButtonModule, TestimonialsFormComponent, TranslateModule,],
  providers: [DialogService],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent implements OnInit {
  @ViewChild(ReusableTableComponent) reusableTableComponent!: ReusableTableComponent<Testimonial>;
  @ViewChild(TestimonialsFormComponent)
  testimonialForm?: TestimonialsFormComponent;

  private service = inject(TestimonialsService);
  private dialogService = inject(DialogService);
  private translate = inject(TranslateService);

  visible = false;
  data: Testimonial[] = [];
  totalRecords = 0;
  selectedItems: Testimonial[] = [];
  currentTestimonialId?: string;
  confirmDialogRef?: DynamicDialogRef;
  paginationObj: PaginationObj = {
    page: 1,
    size: 10,
  };
  filterObj: any;
  emptyStateInfo = {
    label: 'empty_state.testimonials.create_btn',
    description: 'empty_state.testimonials.no_data',
    callback: () => this.showDialog(),
  };

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials(pagination?: PaginationObj) {
    const pag = pagination || this.paginationObj;
    this.service.getAll(pag, this.filterObj?.key || '').subscribe({
      next: (res) => {
        this.data = res.result || [];
        this.totalRecords = res.total;
      },
      error: (err) => console.error('Testimonials fetch error:', err),
    });
  }

  columns: TableColumn<Testimonial>[] = [
    {
      field: 'clientName',
      header: 'testimonials.list.table_headers.name',
      type: 'text',
    },
    {
      field: 'jobTitle',
      header: 'testimonials.list.table_headers.position',
      type: 'text',
    },
    {
      field: 'Testimonial',
      header: 'testimonials.list.table_headers.testimonial',
      type: 'text',
      class: 'max-w-15rem',
    },
    {
      field: 'createdAt',
      header: 'general.date_added',
      type: 'date',
    },
    {
      field: 'status',
      header: 'testimonials.list.table_headers.status',
      type: 'status',
      statusCallback: (row: Testimonial, value: boolean, e: Event) =>
        this.changeStatus(row, value, e),
    },
  ];

  actions: TableAction<Testimonial>[] = [
    {
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

  config: TableConfig<Testimonial> = {
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
      label: 'testimonials.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      btnCallback: () => this.showDialog(),
    },
    {
      type: 'btn',
      label: 'general.import',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
    },
  ];

  showDialog() {
    this.currentTestimonialId = undefined;
    this.visible = true;
  }

  edit(row: Testimonial) {
    this.currentTestimonialId = row.id;
    this.visible = true;
  }

  delete(row: Testimonial) {
    this.showDeleteConfirmDialog(row, 'delete');
  }

  bulkDelete() {
    this.showDeleteConfirmDialog(this.selectedItems, 'bulk-delete');
  }

  selectionChange(e: Testimonial[] | Testimonial) {
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

  showDeleteConfirmDialog(dataToDelete: Testimonial | Testimonial[], actionType: 'delete' | 'bulk-delete' = 'delete') {
    const header =
      actionType === 'delete'
        ? 'testimonials.list.delete_dialog.header'
        : this.translate.instant('testimonials.list.bulk_delete_dialog.header');
    const count = Array.isArray(dataToDelete) ? dataToDelete.length : 0;
    const desc =
      actionType === 'delete'
        ? 'testimonials.list.delete_dialog.desc'
        : this.translate.instant('testimonials.list.bulk_delete_dialog.desc', { count });
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
      header: '',
      width: '505px',
      closable: false,
      styleClass: 'confirm-dialog',
    });

    this.confirmDialogRef.onClose.subscribe((result: any) => {
      if (result && result.action === 'confirm' && result.data) {
        if (!Array.isArray(result.data)) {
          this.performDelete(result.data.id);
        } else {
          const ids = result.data.map((t: Testimonial) => t.id);
          this.service.bulkDelete(ids).subscribe((_) => {
            this.loadTestimonials();
            this.reusableTableComponent.selection = [];
            this.selectedItems = [];
          });
        }
      }
    });
  }

  private performDelete(id: string) {
    this.service.delete(id).subscribe({
      next: () => {
        this.loadTestimonials();
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Failed to delete testimonial');
      },
    });
  }
  changeStatus(row: Testimonial, value: boolean, e: Event) {
    this.service.changeStatus(row.id, value).subscribe();
  }
  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.loadTestimonials();
  }

  onFilterChange(filter: any) {
    this.filterObj = filter;
    this.loadTestimonials();
  }

  handleFormClose(event: TestimonialFormEvent) {
    console.log('Form closed with action:', event.action);

    switch (event.action) {
      case 'save':
        this.handleSave(event.formData);
        break;

      case 'saveAndCreateNew':
        this.handleSaveAndCreateNew(event.formData);
        break;

      default:
        return;
    }
  }
  submitForm(payload: any, isEditMode: boolean, action: ClientFormActions) {
    if (isEditMode) {
      this.service.update(this.currentTestimonialId!, payload).subscribe({
        next: () => {
          if (action === 'save') {
            this.visible = false;
          }
          this.currentTestimonialId = undefined;
          this.testimonialForm?.resetForm();
          this.loadTestimonials();
        },
        error: (err) => {
          console.error('❌ Update error:', err);
        },
      });
    } else {
      // Create new
      this.service.create(payload).subscribe({
        next: (res) => {
          if (action === 'save') {
            this.visible = false;
          }
          this.currentTestimonialId = undefined;
          this.testimonialForm?.resetForm();
          this.loadTestimonials();
        },
        error: (err) => {
          console.error('❌ Create error:', err);
        },
      });
    }
  }
  private handleSave(payload: any) {
    this.submitForm(payload, !!this.currentTestimonialId, 'save');
  }

  private handleSaveAndCreateNew(payload: any) {
    this.submitForm(payload, !!this.currentTestimonialId, 'saveAndCreateNew');
  }

  onDialogHide() {
    this.visible = false;
    this.currentTestimonialId = undefined;
    this.testimonialForm?.resetForm();
  }
}
