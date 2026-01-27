import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ReusableTableComponent } from "../../../../shared/components/reusable-table/reusable-table.component";
import { TableAction, TableColumn, TableConfig } from '../../../../shared/components/reusable-table/reusable-table.types';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TestimonialsFormComponent } from "../testimonials-form/testimonials-form.component";
import { PaginationObj } from '../../../../core/models/global.interface';

export interface Testimonial {
  id: number;
  clientName: string; // English
  clientNameAr: string; // Arabic
  jobTitle: string; // English
  jobTitleAr: string; // Arabic
  testimonial: string; // English
  testimonialAr: string; // Arabic
  dateAdded: string;   // Formatted as MM/DD/YYYY or DD/MM/YYYY
  status: boolean;     // true = active, false = inactive
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReusableTableComponent, DialogModule, ButtonModule, TestimonialsFormComponent],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  // ========================= example table data ============================
  data: Testimonial[] = [
    { "id": 1, "clientName": "Sarah Johnson", "clientNameAr": "", "jobTitle": "CEO", "jobTitleAr": "", "testimonial": "Excellent service and professional team!", "testimonialAr": "", "dateAdded": "12/12/2024", "status": true },
    { "id": 2, "clientName": "Michael Chen", "clientNameAr": "", "jobTitle": "CTO", "jobTitleAr": "", "testimonial": "Great experience working together.", "testimonialAr": "", "dateAdded": "01/05/2025", "status": true },
    { "id": 3, "clientName": "Emily Rodriguez", "clientNameAr": "", "jobTitle": "Marketing Director", "jobTitleAr": "", "testimonial": "Highly recommend their services!", "testimonialAr": "", "dateAdded": "15/01/2025", "status": false },
    { "id": 4, "clientName": "David Kim", "clientNameAr": "", "jobTitle": "Product Manager", "jobTitleAr": "", "testimonial": "Outstanding results delivered on time.", "testimonialAr": "", "dateAdded": "22/02/2025", "status": true },
    { "id": 5, "clientName": "Jessica Martinez", "clientNameAr": "", "jobTitle": "Operations Manager", "jobTitleAr": "", "testimonial": "Professional and reliable team.", "testimonialAr": "", "dateAdded": "10/03/2025", "status": true },
    { "id": 6, "clientName": "Robert Taylor", "clientNameAr": "", "jobTitle": "Finance Director", "jobTitleAr": "", "testimonial": "Exceeded our expectations!", "testimonialAr": "", "dateAdded": "18/03/2025", "status": false },
    { "id": 7, "clientName": "Amanda White", "clientNameAr": "", "jobTitle": "HR Manager", "jobTitleAr": "", "testimonial": "Best decision we made this year.", "testimonialAr": "", "dateAdded": "04/04/2025", "status": true },
    { "id": 8, "clientName": "James Anderson", "clientNameAr": "", "jobTitle": "Project Lead", "jobTitleAr": "", "testimonial": "Incredible attention to detail.", "testimonialAr": "", "dateAdded": "12/04/2025", "status": true },
    { "id": 9, "clientName": "Lisa Thompson", "clientNameAr": "", "jobTitle": "Business Analyst", "jobTitleAr": "", "testimonial": "Very satisfied with the outcome.", "testimonialAr": "", "dateAdded": "25/04/2025", "status": true },
    { "id": 10, "clientName": "Christopher Lee", "clientNameAr": "", "jobTitle": "Sales Director", "jobTitleAr": "", "testimonial": "Fantastic collaboration experience.", "testimonialAr": "", "dateAdded": "02/05/2025", "status": false }
  ];

  totalRecords = this.data.length;

  columns: TableColumn<Testimonial>[] = [
    { field: 'clientName', header: 'Client name', type: 'text' },
    { field: 'jobTitle', header: 'Job Title', type: 'text' },
    { field: 'testimonial', header: 'Testimonial', type: 'text', class: "max-w-15rem overflow-auto custom-scrollbar" },
    { field: 'dateAdded', header: 'Date added', type: 'date', class: "max-w-4rem overflow-auto custom-scrollbar" },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  actions: TableAction<Testimonial>[] = [
    {
      callback: (row) => this.showDialog(), 
      icon: 'pi pi-pencil', 
      severity: 'white',
      class: 'p-2'
    },
    {
      callback: (row, event) => this.delete(row, event), 
      icon: 'pi pi-trash', 
      severity: 'white', 
      visibleWhen: (row: Testimonial) => (row.status),
      class: 'p-2'
    }
  ];

  edit(row: Testimonial, event?: Event) {
    console.log("Edit action triggered", row, event);
  }

  delete(row: Testimonial, event?: Event) {
    console.log("Delete action triggered", row, event);
  }

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
      btnCallback: (e: Event) => this.addNewTestimonial(e)
    },
    {
      type: 'btn',
      label: "Import CSV",
      btnIcon: "pi pi-download",
      btnSeverity: "white",
      btnCallback: (e: Event) => this.importCSV(e)
    },
  ];

  config: TableConfig<Testimonial> = {
    columns: this.columns,
    serverSidePagination: false,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
  };

  onAction(event: { action: string; row: Testimonial }) {
    console.log('Action clicked:', event);
  }

  onPaginationChange(event: PaginationObj) {
    console.log('Pagination changed:', event);
  }

  selectionChange(e: Testimonial[] | Testimonial) {
    console.log('selected items', e);
  }

  addNewTestimonial(e: Event) {
    console.log("Add New Testimonial button clicked", e);
    this.showDialog();
  }

  importCSV(e: Event) {
    console.log("Import CSV button clicked", e);
  }
}