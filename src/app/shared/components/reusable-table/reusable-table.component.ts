import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReusablePaginationComponent } from '../reusable-pagination/reusable-pagination.component';
import { LocaleChip, TableAction, TableConfig } from './reusable-table.types';
import { FormsModule } from '@angular/forms';
import { FilterItems, FiltersComponent } from '../filters/filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationObj } from '../../../core/models/global.interface';
import { environment } from '../../../../environments/environment';

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
    FiltersComponent,
    TranslateModule,
  ],
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss'], // ❌ fix typo: styleUrls not styleUrl
})
export class ReusableTableComponent<T> implements OnChanges {
  @Input() data: T[] = [];
  @Input() totalRecords = 0;
  @Input() config!: TableConfig<T>;
  @Input() actions: TableAction<T>[] = [];
  @Input() selection: T[] | T | null = null;
  @Input() filterItems: FilterItems[] = [];

  @Output() paginationChange = new EventEmitter<{page: number, size: number}>();
  @Output() sortChange = new EventEmitter<{field: string, order: number}>();
  @Output() selectionChange = new EventEmitter<T[] | T>();
  @Output() onServerSideFilterChange = new EventEmitter<any>()

  page = 0;
  filteredData: T[] = [];
  baseMediaUrl = environment.mediaUrl;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.filteredData = this.data;
      this.page = 1; // Reset page on data change
    }
  }

  get rows() {
    return (
      this.config?.rowsPerPage || this.config?.rowsPerPageOptions?.[0] || 10
    );
  }

  get displayedData(): T[] {
    if (this.config?.serverSidePagination) {
      return this.filteredData;
    } else {
      const start = this.page * this.rows;
      const end = start + this.rows;
      return this.filteredData.slice(start, end);
    }
  }

  onPaginationChange(event: PaginationObj) {
    console.log(event)
    this.page = event.page;
    // this.rowsPerPage = event.perPage;
    this.config = {
      ...this.config,
      rowsPerPage : event.size,
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
    this.selection = selection;
    this.selectionChange.emit(this.selection);
  }

  onFilterChange(filters: any) {
    if(this.config.serverSideFilter){
      this.onServerSideFilterChange.emit(filters)
    }else this.applyClientSideFilters(filters);
  }

  private applyClientSideFilters(filters: any) {
    this.filteredData = this.data.filter((row) => {
      for (const key in filters) {
        const value = filters[key];
        if (value != null && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0 && !value.includes((row as any)[key])) {
              return false;
            }
          } else {
            const rowValue = (row as any)[key];
            if (
              rowValue &&
              typeof rowValue === 'string' &&
              !rowValue.toLowerCase().includes(value.toLowerCase())
            ) {
              return false;
            }
          }
        }
      }
      return true;
    });
    this.totalRecords = this.filteredData.length;
    this.page = 1; // Reset to first page
  }

  getVisibleRowActions(row: T): TableAction<T>[] {
    return this.actions.filter((a) => !a.visibleWhen || a.visibleWhen(row));
  }

  getLanguagesChips(
    value: Record<string, boolean> | LocaleChip[],
  ): LocaleChip[] {
    // لو Array (جاهزة للعرض)
    if (Array.isArray(value)) {
      return value;
    }

    // لو Object جاي من API
    if (value && typeof value === 'object') {
      const flagsMap: Record<string, string> = {
        ar: 'images/eg.webp',
        en: 'images/usa.webp',
      };

      return Object.entries(value)
        .filter(([_, isComplete]) => isComplete)
        .map(([code]) => ({
          code: code.toUpperCase(),
          flag: flagsMap[code],
        }));
    }

    return [];
  }
}
