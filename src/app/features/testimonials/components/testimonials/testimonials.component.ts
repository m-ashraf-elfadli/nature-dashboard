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
import { TranslateModule } from '@ngx-translate/core';
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
  @ViewChild(TestimonialsFormComponent)
  testimonialForm?: TestimonialsFormComponent;

  private service = inject(TestimonialsService);
  private dialogService = inject(DialogService);

  visible = false;
  data: Testimonial[] = [];
  totalRecords = 0;
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
    const dialogConfig: ConfirmationDialogConfig<Testimonial> = {
      title: 'testimonials.confirm.delete_title',
      subtitle: `testimonials.confirm.delete_subtitle`,
      icon: 'images/delete.svg',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmSeverity: 'delete',
      cancelSeverity: 'cancel',
      data: row,
    };

    this.confirmDialogRef = this.dialogService.open(ConfirmDialogComponent, {
      modal: true,
      data: dialogConfig,
      header: '',
      width: '505px',
      closable: false,
      styleClass: 'confirm-dialog',
    });

    this.confirmDialogRef.onClose.subscribe((result: any) => {
      if (
        result &&
        result.action === 'confirm' &&
        result.data &&
        result.data.id
      ) {
        this.performDelete(result.data.id);
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
