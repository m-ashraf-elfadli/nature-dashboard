import {
  Component,
  inject,
  OnInit,
  signal,
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
  private readonly service = inject(AwardsService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService)

  public data: WritableSignal<Award[]> = signal([]);
  public totalRecords: WritableSignal<number> = signal(0);

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
      statusCallback:(row:Award,value:boolean,e:Event) => this.changeStatus(row,value,e)
    },
  ];

  emptyStateInfo = {
    label: 'Create New Award',
    description:
      'No Data to preview, start create your first award to appear here!',
    callback: () => this.addNew(),
  };
  actions: TableAction<Award>[] = [
    {
      callback: (row) => this.edit(row),
      icon: 'pi pi-pencil',
      severity: 'white',
      class: 'p-2',
    },
    {
      callback: (row, event) => this.delete(row, event),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'p-2',
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
      btnCallback: (e: Event) => this.addNew(),
    },
    {
      type: 'btn',
      label: 'awards.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
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
  changeStatus(row:Award,value:boolean,e:Event){
    this.service.changeStatus(row.id,value).subscribe()
  }
  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.fetchData(this.paginationObj);
  }
  selectionChange(e: Award[] | Award) {
    console.log('selected items', e);
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
    this.showConfirmDialog(row);
  }
  showConfirmDialog(row: Award) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      width: '40vw',
      modal: true,
      data: {
        title: 'awards.list.delete_dialog.header',
        subtitle: 'awards.list.delete_dialog.desc',
        confirmText: 'general.delete',
        cancelText: 'general.cancel',
        confirmSeverity: 'delete',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: row,
      },
    });
    this.ref.onClose.subscribe((product: { action: string; data: Award }) => {
      if (product) {
        if (product.action === 'confirm') {
          this.service.delete(product.data.id).subscribe({
            next: () => {
              this.fetchData(this.paginationObj);
            },
          });
        }
      }
    });
  }
  customize() {
    this.router.navigate(['/awards/customize']);
  }
}
