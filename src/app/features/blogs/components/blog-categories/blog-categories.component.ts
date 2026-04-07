import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from '../../../../shared/components/reusable-table/reusable-table.component';
import {
  TableAction,
  TableColumn,
  TableConfig,
} from '../../../../shared/components/reusable-table/reusable-table.types';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationObj } from '../../../../core/models/global.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ExportService } from '../../../../shared/services/export.service';
import { environment } from '../../../../../environments/environment';
import { BlogCategoryFormComponent } from '../blog-category-form/blog-category-form.component';
import { BlogsService } from '../../services/blogs.service';
import {
  BlogCategory,
  BlogCategoryFormEvent,
} from '../../models/blogs.model';

@Component({
  selector: 'app-blog-categories',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReusableTableComponent,
    DialogModule,
    ButtonModule,
    BlogCategoryFormComponent,
    TranslateModule,
  ],
  templateUrl: './blog-categories.component.html',
  styleUrl: './blog-categories.component.scss',
})
export class BlogCategoriesComponent implements OnInit, OnDestroy {
  @ViewChild(ReusableTableComponent)
  reusableTableComponent!: ReusableTableComponent<BlogCategory>;
  @ViewChild(BlogCategoryFormComponent)
  categoryForm?: BlogCategoryFormComponent;

  private readonly service = inject(BlogsService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly exportService = inject(ExportService);
  private langChangeSubscription?: Subscription;

  visible = false;
  data: BlogCategory[] = [];
  selectedItems: BlogCategory | BlogCategory[] = [];
  totalRecords = 0;
  currentCategoryId?: string;
  confirmDialogRef?: DynamicDialogRef;
  paginationObj: PaginationObj = { page: 1, size: 10 };
  filterObj: { value?: string } = {};
  emptyStateInfo = {
    label: 'blogs.categories.empty.create_btn',
    description: 'blogs.categories.empty.no_data',
    callback: () => this.showDialog(),
  };

  ngOnInit(): void {
    this.loadCategories();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() =>
      this.loadCategories(),
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  loadCategories(pagination?: PaginationObj): void {
    const pag = pagination || this.paginationObj;
    this.service.getCategories(pag, this.filterObj?.value || '').subscribe({
      next: (res) => {
        this.data = res.result || [];
        this.totalRecords = res.total;
      },
      error: (err) => console.error('Blog categories fetch error:', err),
    });
  }

  columns: TableColumn<BlogCategory>[] = [
    {
      field: 'name',
      header: 'blogs.categories.table.name',
      type: 'text',
    },
    {
      field: 'image',
      header: 'blogs.categories.table.image',
      type: 'image',
    },
    {
      field: 'created_at',
      header: 'general.date_added',
      type: 'date',
    },
    {
      field: 'status',
      header: 'blogs.categories.table.status',
      type: 'status',
      statusCallback: (row, value, e) => this.changeStatus(row, value, e),
    },
  ];

  actions: TableAction<BlogCategory>[] = [
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

  config: TableConfig<BlogCategory> = {
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
      name: 'value',
      placeholder: 'blogs.categories.search_placeholder',
    },
    {
      type: 'btn',
      label: 'general.export',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      anmSeverity: 'bg-grow',
      btnCallback: () => this.export(),
    },
    {
      type: 'btn',
      label: 'blogs.categories.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      anmSeverity: 'expand-gap',
      btnCallback: () => this.showDialog(),
    },
  ];

  showDialog(): void {
    this.currentCategoryId = undefined;
    this.visible = true;
  }

  edit(row: BlogCategory): void {
    this.currentCategoryId = row.id;
    this.visible = true;
  }

  delete(row: BlogCategory): void {
    this.showDeleteConfirmDialog(row, 'delete');
  }

  showDeleteConfirmDialog(
    data: BlogCategory | BlogCategory[],
    actionType: 'delete' | 'bulk-delete',
  ): void {
    const header =
      actionType === 'delete'
        ? 'blogs.categories.delete_dialog.header'
        : 'blogs.categories.bulk_delete_dialog.header';
    const count = Array.isArray(data) ? data.length : 0;
    const desc =
      actionType === 'delete'
        ? 'blogs.categories.delete_dialog.desc'
        : this.translate.instant('blogs.categories.bulk_delete_dialog.desc', {
            count,
          });
    this.confirmDialogRef = this.dialogService.open(ConfirmDialogComponent, {
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
        data,
      },
    });
    this.confirmDialogRef.onClose.subscribe(
      (product: { action: string; data: BlogCategory | BlogCategory[] }) => {
        if (product?.action === 'confirm') {
          if (!Array.isArray(product.data)) {
            this.service.deleteCategory(product.data.id).subscribe({
              next: () => this.loadCategories(this.paginationObj),
            });
          } else {
            const ids = product.data.map((x) => x.id);
            this.service.bulkDeleteCategories(ids).subscribe(() => {
              this.loadCategories(this.paginationObj);
              this.reusableTableComponent.selection = [];
              this.selectedItems = [];
              this.addAndHideBulkDeleteBtn();
            });
          }
        }
      },
    );
  }

  export(): void {
    this.exportService.exportModule(environment.blogs.categoriesApiPath);
  }

  changeStatus(row: BlogCategory, value: boolean, _e?: Event): void {
    this.service.changeCategoryStatus(row.id, value).subscribe();
  }

  onPaginationChange(event: PaginationObj): void {
    this.paginationObj = event;
    this.loadCategories();
  }

  onFilterChange(filter: { value?: string }): void {
    this.filterObj = filter;
    this.loadCategories();
  }

  selectionChange(e: BlogCategory[] | BlogCategory): void {
    this.selectedItems = Array.isArray(e) ? e : [e];
    this.addAndHideBulkDeleteBtn();
  }

  addAndHideBulkDeleteBtn(): void {
    const hasSelection =
      Array.isArray(this.selectedItems) && this.selectedItems.length > 0;
    const bulkDeleteBtn: FilterItems = {
      label: 'general.delete_selected',
      type: 'btn',
      name: 'delete-btn',
      btnIcon: 'pi pi-trash',
      btnSeverity: 'white',
      btnCallback: () => this.bulkDelete(),
    };
    if (hasSelection) {
      const withoutBulk = this.filterItems.filter((f) => f.name !== 'delete-btn');
      this.filterItems = [bulkDeleteBtn, ...withoutBulk];
    } else {
      this.filterItems = this.filterItems.filter((f) => f.name !== 'delete-btn');
    }
  }

  bulkDelete(): void {
    this.showDeleteConfirmDialog(this.selectedItems, 'bulk-delete');
  }

  handleFormClose(event: BlogCategoryFormEvent): void {
    switch (event.action) {
      case 'save':
        this.submit(event.formData!, 'save');
        break;
      case 'saveAndCreateNew':
        this.submit(event.formData!, 'saveAndCreateNew');
        break;
      case 'cancel':
        this.visible = false;
        this.currentCategoryId = undefined;
        break;
      default:
        break;
    }
  }

  private submit(
    payload: NonNullable<BlogCategoryFormEvent['formData']>,
    action: 'save' | 'saveAndCreateNew',
  ): void {
    const isEdit = !!this.currentCategoryId;
    const done = () => {
      if (action === 'save') {
        this.visible = false;
      }
      this.currentCategoryId = undefined;
      this.categoryForm?.resetForm();
      this.loadCategories();
    };
    if (isEdit) {
      this.service.updateCategory(this.currentCategoryId!, payload).subscribe({
        next: () => done(),
        error: (err) => console.error(err),
      });
    } else {
      this.service.createCategory(payload).subscribe({
        next: () => done(),
        error: (err) => console.error(err),
      });
    }
  }

  onDialogHide(): void {
    this.visible = false;
    this.currentCategoryId = undefined;
    this.categoryForm?.resetForm();
  }
}
