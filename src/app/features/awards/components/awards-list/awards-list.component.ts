import {
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  TableAction,
  TableColumn,
  TableConfig,
} from '../../../../shared/components/reusable-table/reusable-table.types';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { ReusableTableComponent } from '../../../../shared/components/reusable-table/reusable-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Award } from '../../models/awards.interface';
import { PaginationObj } from '../../../../core/models/global.interface';
import { AwardsService } from '../../../../services/awards.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-awards-list',
  imports: [
    CommonModule,
    ReusableTableComponent,
    PageHeaderComponent,
    TranslateModule,
  ],
  templateUrl: './awards-list.component.html',
  styleUrl: './awards-list.component.scss',
})
export class AwardsListComponent implements OnInit {
  @ViewChild(ReusableTableComponent) reusableTableComponent!: ReusableTableComponent<Award>;
  private readonly service = inject(AwardsService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);

  data: WritableSignal<Award[]> = signal([]);
  selectedItems: Award[] = []
  totalRecords: WritableSignal<number> = signal(0);

  paginationObj: PaginationObj = {
    page: 1,
    size: 10,
  };
  filterObj: any;
  ref: DynamicDialogRef | undefined;

  columns: TableColumn<Award>[] = [
    {
      field: 'name',
      header: 'awards.list.table_headers.award',
      type: 'avatar-and-name',
      avatarField: 'image',
    },
    {
      field: 'awardDate',
      header: 'awards.list.table_headers.date',
      type: 'date',
    },
    {
      field: 'description',
      header: 'awards.list.table_headers.description',
      type: 'text-editor',
    },
    {
      field: 'status',
      header: 'awards.list.table_headers.status',
      type: 'status',
      statusCallback: (row: Award, value: boolean, e: Event) =>
        this.changeStatus(row, value, e),
    },
  ];

  emptyStateInfo = {
    label: 'empty_state.awards.create_btn',
    description: 'empty_state.awards.no_data',
    callback: () => this.addNew(),
  };
  actions: TableAction<Award>[] = [
    {
      callback: (row) => this.edit(row),
      severity: 'white',
      class: 'padding-action-btn',
    },
    {
      callback: (row, event) => this.delete(row, event),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'padding-action-btn',
    },
  ];

  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'key',
      placeholder: 'general.search_input_table_placeholder',
    },
    {
      type: 'btn',
      label: 'awards.list.btns.customize',
      btnIcon: 'pi pi-cog',
      btnSeverity: 'white',
      btnCallback: (e: Event) => this.customize(),
    },
    {
      type: 'btn',
      label: 'general.import',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      anmSeverity: 'bg-grow',
      btnCallback: (e: Event) => this.addNew(),
    },
    {
      type: 'btn',
      label: 'awards.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      anmSeverity: 'expand-gap',
      btnCallback: (e: Event) => this.addNew(),
    },
  ];
  config: TableConfig<Award> = {
    columns: this.columns,
    rowsPerPage: 10,
    serverSidePagination: true,
    serverSideFilter: true,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
  };

  ngOnInit(): void {
    this.fetchData(this.paginationObj);
    this.translate.onLangChange.subscribe((_) => {
      this.fetchData(this.paginationObj);
    });
  }

  fetchData(pagination: PaginationObj) {
    this.service.getAll(pagination, this.filterObj?.key || '').subscribe({
      next: (res) => {
        this.data.set(res.result);
        this.totalRecords.set(res.total!);
      },
      error: (err) => {
        console.error('Failed to load projects', err);
      },
    });
  }
  changeStatus(row: Award, value: boolean, e: Event) {
    this.service.changeStatus(row.id, value).subscribe();
  }
  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.fetchData(this.paginationObj);
  }
  addAndHideBulkDeleteBtn() {
    const hasSelection = Array.isArray(this.selectedItems) && this.selectedItems.length > 0;
    const bulkDeleteBtn: FilterItems = {
      label: 'general.delete_selected',
      type: 'btn',
      name: 'bulk-delete-btn',
      btnIcon: "pi pi-trash",
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
  bulkDelete() {
    this.showDeleteConfirmDialog(this.selectedItems, 'bulk-delete')
  }
  selectionChange(e: Award[] | Award) {
    this.selectedItems = Array.isArray(e) ? e : [e]
    this.addAndHideBulkDeleteBtn();
  }
  onFilterChange(filter: any) {
    this.filterObj = filter;
    this.fetchData(this.paginationObj);
  }
  addNew() {
    this.router.navigate(['/awards/add']);
  }
  edit(row: Award, event?: Event) {
    this.router.navigate(['/awards/edit', row.id]);
  }
  delete(row: Award, event?: Event) {
    this.showDeleteConfirmDialog(row, 'delete');
  }
  showDeleteConfirmDialog(dataToDelete: Award | Award[], actionType: 'delete' | 'bulk-delete' = 'delete') {
    const header =
      actionType === 'delete'
        ? 'awards.list.delete_dialog.header'
        : this.translate.instant('awards.list.bulk_delete_dialog.header');
    const count = Array.isArray(dataToDelete) ? dataToDelete.length : 0;
    const desc =
      actionType === 'delete'
        ? 'awards.list.delete_dialog.desc'
        : this.translate.instant('awards.list.bulk_delete_dialog.desc', { count });
    const data = dataToDelete;
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      width: '40vw',
      modal: true,
      data: {
        title: header,
        subtitle: desc,
        confirmText: 'general.delete',
        cancelText: 'general.cancel',
        icon: 'images/delete.svg',
        confirmSeverity: 'delete',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: data,
      },
    });
    this.ref.onClose.subscribe((product: { action: string; data: Award | Award[] }) => {
      if (product && product.action === 'confirm') {
        if (!Array.isArray(product.data)) {
          this.service.delete(product.data.id).subscribe({
            next: () => {
              this.fetchData(this.paginationObj);
            },
          });
        } else {
          const ids = product.data.map((a: Award) => a.id);
          this.service.bulkDelete(ids).subscribe((_) => {
            this.fetchData(this.paginationObj);
            this.reusableTableComponent.selection = [];
            this.selectedItems = [];
            this.addAndHideBulkDeleteBtn()
          });
        }
      }
    });
  }
  customize() {
    this.router.navigate(['/awards/customize']);
  }
}
