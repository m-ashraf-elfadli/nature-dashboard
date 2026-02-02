import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ReusableTableComponent } from "../../../../shared/components/reusable-table/reusable-table.component";
import { TableAction, TableColumn, TableConfig } from '../../../../shared/components/reusable-table/reusable-table.types';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TestimonialsFormComponent } from "../testimonials-form/testimonials-form.component";
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { TestimonialsService } from '../../services/testimonials.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent, ConfirmationDialogConfig } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationObj } from '../../../../core/models/global.interface';
import { Testimonial, TestimonialFormEvent } from '../../models/testimonials.model';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReusableTableComponent,
    DialogModule,
    ButtonModule,
    TestimonialsFormComponent
  ],
  providers: [DialogService],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit {
  @ViewChild(TestimonialsFormComponent) testimonialForm?: TestimonialsFormComponent;

  private testimonialsService = inject(TestimonialsService);
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

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials(pagination?: PaginationObj) {
    const pag = pagination || this.paginationObj;
    this.testimonialsService.getAll(pag, this.filterObj?.key || '').subscribe({
      next: (res) => {
        this.data = res.result || [];
        this.totalRecords = res.total;
      },
      error: (err) => console.error('Testimonials fetch error:', err)
    });
  }

  columns: TableColumn<Testimonial>[] = [
    { field: 'clientName', header: 'Client name', type: 'text' },
    { field: 'jobTitle', header: 'Job Title', type: 'text' },
    { field: 'Testimonial', header: 'Testimonial', type: 'text', class: "max-w-15rem" },
    { field: 'createdAt', header: 'Date added', type: 'date' },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  actions: TableAction<Testimonial>[] = [
    {
      icon: 'pi pi-pencil',
      callback: (row) => this.edit(row),
      severity: 'white',
      class: 'p-2'
    },
    {
      icon: 'pi pi-trash',
      callback: (row) => this.delete(row),
      severity: 'white',
      class: 'p-2'
    }
  ];

  config: TableConfig<Testimonial> = {
    columns: this.columns,
    serverSidePagination: true,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideFilter: true
  };

  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'key',
      placeholder: 'Search by name ...'
    },
    {
      type: 'btn',
      label: "Add New Testimonial",
      btnIcon: "pi pi-plus",
      btnSeverity: "primary",
      btnCallback: () => this.showDialog()
    }
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
      title: 'Delete Testimonial',
      subtitle: `Are you sure you want to delete the testimonial from "${row.clientName}"? This action cannot be undone.`,
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
      if (result && result.action === 'confirm' && result.data && result.data.id) {
        this.performDelete(result.data.id);
      }
    });
  }

  private performDelete(id: string) {
    this.testimonialsService.delete(id).subscribe({
      next: () => {
        this.loadTestimonials();
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Failed to delete testimonial');
      }
    });
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

      case 'cancel':
        this.handleCancel();
        break;
    }
  }

  private handleSave(payload: any) {
    if (this.currentTestimonialId) {
      // Update existing
      this.testimonialsService.update(this.currentTestimonialId, payload).subscribe({
        next: (res) => {
          console.log('✅ Update success:', res);
          this.visible = false;
          this.currentTestimonialId = undefined;
          this.loadTestimonials();
        },
        error: (err) => {
          console.error('❌ Update error:', err);
          this.showErrorMessage(err);
        }
      });
    } else {
      // Create new
      this.testimonialsService.create(payload).subscribe({
        next: (res) => {
          console.log('✅ Create success:', res);
          this.visible = false;
          this.loadTestimonials();
        },
        error: (err) => {
          console.error('❌ Create error:', err);
          this.showErrorMessage(err);
        }
      });
    }
  }

  private handleSaveAndCreateNew(payload: any) {
    this.testimonialsService.create(payload).subscribe({
      next: () => {
        this.loadTestimonials();
        this.currentTestimonialId = undefined;
        this.testimonialForm?.resetForm();
      },
      error: (err) => {
        this.showErrorMessage(err);
      }
    });
  }

  private handleCancel() {
    console.log('Form cancelled');
    this.visible = false;
    this.currentTestimonialId = undefined;
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

    alert(`Failed to save testimonial:\n${errorMessage}`);
  }

  onDialogHide() {
    this.currentTestimonialId = undefined;
  }

  ngOnDestroy() {
    if (this.confirmDialogRef) {
      this.confirmDialogRef.close();
    }
  }
}