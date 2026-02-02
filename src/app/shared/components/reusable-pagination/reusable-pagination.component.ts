import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PaginationObj } from '../../../core/models/global.interface';

@Component({
  selector: 'app-reusable-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  templateUrl: './reusable-pagination.component.html',
  styleUrl: './reusable-pagination.component.scss'
})
export class ReusablePaginationComponent implements OnInit {
  @Input() totalRecords = 0;
  @Input() page = 0;
  @Input() rows!: number;
  @Input() rowsOptions: number[] = [5, 10, 20, 50];

  @Output() paginationChange = new EventEmitter<PaginationObj>();

  ngOnInit() {
    this.rows = this.rows ?? this.rowsOptions[0];
  }

  /** total pages */
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  /** page numbers */
  get pages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.page;
    if (total <= 4) {
      return Array.from({ length: total }, (_, i) => i);
    }
    if (total === 5) {
      return [0, 1, 2, '...', 4];
    }
    const pages: (number | string)[] = [0];
    if (current > 2) pages.push('...');
    if (current === 0 && total > 3) {
      pages.push(1, 2);
    } else {
      const start = Math.max(1, current - (current === total - 1 ? 2 : 1));
      const end = Math.min(total - 1, current + (current === total - 1 ? 2 : 1));
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    if (pages.includes(total - 1)) {
      if (current < total - 3) pages.push('...');
    } else {
      if (current < total - 3) pages.push('...');
      pages.push(total - 1);
    }
    return pages;
  }

  prev() {
    if (this.page > 0) {
      this.onPaginationChange({ page: this.page - 1 });
    }
  }

  next() {
    if (this.page < this.totalPages - 1) {
      this.onPaginationChange({ page: this.page + 1 });
    }
  }

  go(page: number) {
    this.onPaginationChange({ page:page + 1 });
  }

  onPaginationChange(change: { page?: number; size?: number }) {
    if (change.page !== undefined) {
      this.page = change.page;
    }
    if (change.size !== undefined) {
      this.rows = change.size;
      this.page = 1;
    }
    this.paginationChange.emit({ page: this.page, size: this.rows });
  }

  /** Returns the index of the last item shown on the current page */
  getLastItemIndex(): number {
    return Math.min((this.page + 1) * this.rows, this.totalRecords);
  }
}
