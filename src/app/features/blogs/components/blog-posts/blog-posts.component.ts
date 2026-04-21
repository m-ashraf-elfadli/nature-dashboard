import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from '../../../../shared/components/reusable-table/reusable-table.component';
import {
  TableAction,
  TableColumn,
  TableConfig,
} from '../../../../shared/components/reusable-table/reusable-table.types';
import { ButtonModule } from 'primeng/button';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationObj } from '../../../../core/models/global.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ExportService } from '../../../../shared/services/export.service';
import { BlogsService } from '../../services/blogs.service';
import { BlogPost } from '../../models/blogs.model';

@Component({
  selector: 'app-blog-posts',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReusableTableComponent,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: './blog-posts.component.html',
  styleUrl: './blog-posts.component.scss',
})
export class BlogPostsComponent implements OnInit, OnDestroy {
  @ViewChild(ReusableTableComponent)
  reusableTableComponent!: ReusableTableComponent<BlogPost>;

  private readonly service = inject(BlogsService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly exportService = inject(ExportService);
  private langChangeSubscription?: Subscription;

  data: BlogPost[] = [];
  selectedItems: BlogPost | BlogPost[] = [];
  totalRecords = 0;
  confirmDialogRef?: DynamicDialogRef;
  paginationObj: PaginationObj = { page: 1, size: 10 };
  filterObj: { value?: string } = {};
  emptyStateInfo = {
    label: 'blogs.posts.empty.create_btn',
    description: 'blogs.posts.empty.no_data',
    callback: () => this.goToAdd(),
  };

  ngOnInit(): void {
    this.loadPosts();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() =>
      this.loadPosts(),
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  loadPosts(pagination?: PaginationObj): void {
    const pag = pagination || this.paginationObj;
    this.service
      .getPosts(pag, this.filterObj?.value || '', this.translate.currentLang || 'en')
      .subscribe({
      next: (res) => {
        this.data = res.result || [];
        this.totalRecords = res.total;
      },
      error: (err) => console.error('Blog posts fetch error:', err),
      });
  }

  columns: TableColumn<BlogPost>[] = [
    {
      field: 'title',
      header: 'blogs.posts.table.title',
      type: 'text',
    },
    {
      field: 'category_name',
      header: 'blogs.posts.table.category',
      type: 'text',
    },
    {
      field: 'views',
      header: 'blogs.posts.table.views',
      type: 'views',
    },
    {
      field: 'created_at',
      header: 'general.date_added',
      type: 'date',
    },
    {
      field: 'localeComplete',
      header: 'projects.list.table_headers.locale',
      type: 'languages-chips',
    },
    {
      field: 'image',
      header: 'blogs.posts.table.image',
      type: 'image',
    },
    {
      field: 'status',
      header: 'blogs.posts.table.status',
      type: 'status',
      statusCallback: (row, value, e) => this.changeStatus(row, value, e),
    },
  ];

  actions: TableAction<BlogPost>[] = [
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

  config: TableConfig<BlogPost> = {
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
      placeholder: 'blogs.posts.search_placeholder',
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
      label: 'blogs.posts.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      anmSeverity: 'expand-gap',
      btnCallback: () => this.goToAdd(),
    },
  ];

  goToAdd(): void {
    this.router.navigate(['/blogs/posts/add']);
  }

  edit(row: BlogPost): void {
    this.router.navigate(['/blogs/posts/edit', row.id]);
  }

  delete(row: BlogPost): void {
    this.showDeleteConfirmDialog(row, 'delete');
  }

  showDeleteConfirmDialog(
    data: BlogPost | BlogPost[],
    actionType: 'delete' | 'bulk-delete',
  ): void {
    const header =
      actionType === 'delete'
        ? 'blogs.posts.delete_dialog.header'
        : 'blogs.posts.bulk_delete_dialog.header';
    const count = Array.isArray(data) ? data.length : 0;
    const desc =
      actionType === 'delete'
        ? 'blogs.posts.delete_dialog.desc'
        : this.translate.instant('blogs.posts.bulk_delete_dialog.desc', {
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
      (product: { action: string; data: BlogPost | BlogPost[] }) => {
        if (product?.action === 'confirm') {
          if (!Array.isArray(product.data)) {
            this.service.deletePost(product.data.id).subscribe({
              next: () => this.loadPosts(this.paginationObj),
            });
          } else {
            const ids = product.data.map((x) => x.id);
            this.service.bulkDeletePosts(ids).subscribe(() => {
              this.loadPosts(this.paginationObj);
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
    this.exportService.exportModule('blogs');
  }

  changeStatus(row: BlogPost, value: boolean, _e?: Event): void {
    this.service.changePostStatus(row.id, value).subscribe();
  }

  onPaginationChange(event: PaginationObj): void {
    this.paginationObj = event;
    this.loadPosts();
  }

  onFilterChange(filter: { value?: string }): void {
    this.filterObj = filter;
    this.loadPosts();
  }

  selectionChange(e: BlogPost[] | BlogPost): void {
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
}
