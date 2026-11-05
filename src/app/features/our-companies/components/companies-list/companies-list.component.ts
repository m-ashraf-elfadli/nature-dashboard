import { Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginationObj } from '../../../../core/models/global.interface';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from '../../../../shared/components/reusable-table/reusable-table.component';
import {
  TableAction,
  TableColumn,
  TableConfig,
} from '../../../../shared/components/reusable-table/reusable-table.types';
import { CompanyRow } from '../../models/our-companies.model';
import { OurCompaniesService } from '../../services/our-companies.service';

const BULK_DELETE_BTN = 'bulk-delete-btn';

@Component({
  selector: 'app-companies-list',
  imports: [ReusableTableComponent, PageHeaderComponent, TranslateModule],
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss',
})
export class CompaniesListComponent implements OnInit {
  @ViewChild(ReusableTableComponent) table?: ReusableTableComponent<CompanyRow>;

  private readonly service = inject(OurCompaniesService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly data = signal<CompanyRow[]>([]);
  readonly totalRecords = signal(0);
  selectedItems: CompanyRow[] = [];
  private pagination: PaginationObj = { page: 1, size: 10 };
  private search = '';
  private ref?: DynamicDialogRef;

  readonly columns: TableColumn<CompanyRow>[] = [
    {
      field: 'name',
      header: 'our_companies.list.table_headers.name',
      type: 'avatar-and-name',
      avatarField: 'logo',
    },
    { field: 'location', header: 'our_companies.list.table_headers.location' },
    { field: 'services_label', header: 'our_companies.list.table_headers.services' },
    { field: 'updated_label', header: 'our_companies.list.table_headers.last_updated' },
    {
      field: 'status',
      header: 'our_companies.list.table_headers.status',
      type: 'status',
      statusCallback: (row, value) => this.service.changeStatus(row.id, value).subscribe(),
    },
  ];

  readonly actions: TableAction<CompanyRow>[] = [
    { callback: (row) => this.edit(row), severity: 'white', class: 'padding-action-btn' },
    {
      callback: (row) => this.confirmDelete(row),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'padding-action-btn',
    },
  ];

  filterItems: FilterItems[] = [
    { type: 'search', name: 'key', placeholder: 'our_companies.list.search_placeholder' },
    {
      type: 'btn',
      label: 'general.export',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      anmSeverity: 'bg-grow',
      btnCallback: () => this.service.export(),
    },
    {
      type: 'btn',
      label: 'our_companies.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      anmSeverity: 'expand-gap',
      btnCallback: () => this.addNew(),
    },
  ];

  readonly emptyStateInfo = {
    label: 'our_companies.list.empty.create_btn',
    description: 'our_companies.list.empty.no_data',
    callback: () => this.addNew(),
  };

  readonly config: TableConfig<CompanyRow> = {
    columns: this.columns,
    rowsPerPage: 10,
    serverSidePagination: true,
    serverSideFilter: true,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: false,
  };

  ngOnInit(): void {
    this.fetchData();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchData());
  }

  fetchData(): void {
    this.service.getCompanies(this.pagination, this.search).subscribe({
      next: (res) => {
        this.data.set(res.result ?? []);
        this.totalRecords.set(res.total ?? 0);
      },
    });
  }

  onPaginationChange(event: PaginationObj): void {
    this.pagination = event;
    this.fetchData();
  }

  onFilterChange(filter: { key?: string }): void {
    this.search = filter?.key ?? '';
    this.pagination = { ...this.pagination, page: 1 };
    this.fetchData();
  }

  selectionChange(selection: CompanyRow[] | CompanyRow): void {
    this.selectedItems = Array.isArray(selection) ? selection : [selection];
    this.toggleBulkDeleteBtn();
  }

  addNew(): void {
    this.router.navigate(['/our-companies/add']);
  }

  edit(row: CompanyRow): void {
    this.router.navigate(['/our-companies/edit', row.id]);
  }

  private toggleBulkDeleteBtn(): void {
    const others = this.filterItems.filter((f) => f.name !== BULK_DELETE_BTN);
    this.filterItems = this.selectedItems.length
      ? [
          {
            label: 'general.delete_selected',
            type: 'btn',
            name: BULK_DELETE_BTN,
            btnIcon: 'pi pi-trash',
            btnSeverity: 'white',
            btnCallback: () => this.confirmDelete(this.selectedItems),
          },
          ...others,
        ]
      : others;
  }

  private confirmDelete(target: CompanyRow | CompanyRow[]): void {
    const isBulk = Array.isArray(target);
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      width: '40vw',
      modal: true,
      data: {
        title: this.translate.instant(
          isBulk ? 'our_companies.list.bulk_delete_dialog.header' : 'our_companies.list.delete_dialog.header',
        ),
        subtitle: this.translate.instant(
          isBulk ? 'our_companies.list.bulk_delete_dialog.desc' : 'our_companies.list.delete_dialog.desc',
          { count: isBulk ? target.length : 1 },
        ),
        confirmText: 'general.delete',
        cancelText: 'general.cancel',
        icon: 'images/delete.svg',
        confirmSeverity: 'delete',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: target,
      },
    });

    this.ref.onClose.subscribe((result: { action: string } | undefined) => {
      if (result?.action !== 'confirm') return;
      const request$ = isBulk
        ? this.service.bulkDelete(target.map((c) => c.id))
        : this.service.delete(target.id);
      request$.subscribe(() => {
        if (isBulk) {
          if (this.table) this.table.selection = [];
          this.selectedItems = [];
          this.toggleBulkDeleteBtn();
        }
        this.fetchData();
      });
    });
  }
}
