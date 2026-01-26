import { Component, OnInit, inject } from '@angular/core';
import { TestimonialsService } from '../../services/testimonials.service';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ReusableTableComponent } from "../../../../shared/components/reusable-table/reusable-table.component";
import { TableAction, TableColumn, TableConfig } from '../../../../shared/components/reusable-table/reusable-table.types';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TestimonialsFormComponent } from "../testimonials-form/testimonials-form.component";
import { FilterItems } from '../../../../shared/components/filters/filters.component';

// ================== Inline Interface ==================
export interface Testimonial {
  id: string;
  clientName: string;
  jobTitle: string;
  testimonial: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
// =======================================================

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ReusableTableComponent,
    DialogModule,
    ButtonModule,
    TestimonialsFormComponent
  ],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit {

  private testimonialsService = inject(TestimonialsService);

  visible = false;
  data: Testimonial[] = [];
  totalRecords = 0;

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials(page = 1, size = 10) {
    this.testimonialsService.getAll(page, size).subscribe({
      next: (res) => {
        const arr = res.result || [];

        this.data = arr.map((item: any) => ({
          id: item.id,
          clientName: item.clientName,
          jobTitle: item.jobTitle,
          testimonial: item.Testimonial,   // backend uses capital T
          status: item.status === 1,        // convert 1/0 → boolean
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        this.totalRecords = res.total;
      },
      error: (err) => console.error('Testimonials fetch error:', err)
    });
  }

  // ================= Table Config =================

  columns: TableColumn<Testimonial>[] = [
    { field: 'clientName', header: 'Client name', type: 'text' },
    { field: 'jobTitle', header: 'Job Title', type: 'text' },
    { field: 'testimonial', header: 'Testimonial', type: 'text', class: "max-w-15rem" },
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
      visibleWhen: (row) => row.status,
      class: 'p-2'
    }
  ];

  config: TableConfig<Testimonial> = {
    columns: this.columns,
    serverSidePagination: true,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true
  };

  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'keyword',
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

  // ================= Actions =================

  showDialog() {
    this.visible = true;
  }

  edit(row: Testimonial) {
    console.log('Edit:', row);
    this.visible = true;
  }

  delete(row: Testimonial) {
    this.testimonialsService.delete(row.id).subscribe({
      next: () => this.loadTestimonials()
    });
  }

  onPaginationChange(event: { page: number; perPage: number }) {
    this.loadTestimonials(event.page, event.perPage);
  }

  createTestimonial(payload: any) {
    this.testimonialsService.create(payload).subscribe({
      next: () => {
        this.visible = false;
        this.loadTestimonials();
      }
    });
  }
}
