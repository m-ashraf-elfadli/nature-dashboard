import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReusablePaginationComponent } from '../reusable-pagination/reusable-pagination.component';
import { TableAction, TableConfig } from './reusable-table.types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reusable-table',
  standalone: true, // ✅ mark as standalone component
  imports: [
    CommonModule,
    TableModule,
    CheckboxModule,
    InputSwitchModule,
    ButtonModule,
    RadioButtonModule,
    FormsModule,
    ReusablePaginationComponent,

  ],
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss'], // ❌ fix typo: styleUrls not styleUrl
})
export class ReusableTableComponent<T> {
  @Input() data: T[] = [];
  @Input() totalRecords = 0;
  @Input() config!: TableConfig<T>;
  @Input() actions: TableAction<T>[] = [];
  @Input() selection: T[] | T | null = null;

  @Output() paginationChange = new EventEmitter<{page: number, perPage: number}>();
  @Output() sortChange = new EventEmitter<{field: string, order: number}>();
  @Output() selectionChange = new EventEmitter<T[] | T>();

  page = 0;

  get rows() {
    return this.config?.rowsPerPage || this.config?.rowsPerPageOptions?.[0] || 10;
  }

  get displayedData(): T[] {
    if (this.config?.serverSidePagination) {
      return this.data;
    } else {
      const start = this.page * this.rows;
      const end = start + this.rows;
      return this.data.slice(start, end);
    }
  }

  onPaginationChange(event: {page: number, perPage: number}) {
    this.page = event.page;
    // this.rowsPerPage = event.perPage;
    this.config = {
      ...this.config,
      rowsPerPage : event.perPage,
    }

    if (this.config?.serverSidePagination) {
      this.paginationChange.emit(event);
    }
  }

  onSort(event: any) {
    if (this.config?.serverSideSort) {
      this.sortChange.emit({ field: event.field, order: event.order });
    }
  }

  onSelectionChange(selection: T[] | T) {
    this.selection = selection
    this.selectionChange.emit(this.selection);
  }

  getVisibleRowActions(row: T): TableAction<T>[] {
        return this.actions.filter(
            (a) => !a.visibleWhen || a.visibleWhen(row)
        );
    }
}
