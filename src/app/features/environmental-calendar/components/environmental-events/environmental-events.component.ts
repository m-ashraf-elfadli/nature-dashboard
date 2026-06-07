import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from '../../../../shared/components/reusable-table/reusable-table.component';
import {
  TableAction,
  TableColumn,
  TableConfig,
} from '../../../../shared/components/reusable-table/reusable-table.types';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationObj } from '../../../../core/models/global.interface';
import { ExportService } from '../../../../shared/services/export.service';
import { EnvironmentalCalendarService } from '../../services/environmental-calendar.service';
import {
  EnvironmentalEvent,
  EnvironmentalEventFormEvent,
} from '../../models/environmental-calendar.model';
import { EVENT_TYPES } from '../../data/event.constants';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-environmental-events',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReusableTableComponent,
    DialogModule,
    ButtonModule,
    EventFormComponent,
    TranslateModule,
  ],
  templateUrl: './environmental-events.component.html',
  styleUrl: './environmental-events.component.scss',
})
export class EnvironmentalEventsComponent implements OnInit, OnDestroy {
  @ViewChild(ReusableTableComponent)
  reusableTableComponent!: ReusableTableComponent<EnvironmentalEvent>;
  @ViewChild(EventFormComponent)
  eventForm?: EventFormComponent;

  private readonly service = inject(EnvironmentalCalendarService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly exportService = inject(ExportService);
  private langChangeSubscription?: Subscription;

  visible = false;
  data: EnvironmentalEvent[] = [];
  selectedItems: EnvironmentalEvent | EnvironmentalEvent[] = [];
  totalRecords = 0;
  currentEventId?: string;
  confirmDialogRef?: DynamicDialogRef;
  paginationObj: PaginationObj = { page: 1, size: 10 };
  filterObj: { value?: string } = {};
  emptyStateInfo = {
    label: 'environmental_calendar.empty.create_btn',
    description: 'environmental_calendar.empty.no_data',
    callback: () => this.showDialog(),
  };

  ngOnInit(): void {
    this.loadEvents();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() =>
      this.loadEvents(),
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  loadEvents(pagination?: PaginationObj): void {
    const pag = pagination || this.paginationObj;
    this.service.getEvents(pag, this.filterObj?.value || '').subscribe({
      next: (res) => {
        this.data = (res.result || []).map((row) => ({
          ...row,
          event_type_label: this.eventTypeLabel(row.event_type),
        }));
        this.totalRecords = res.total;
      },
      error: (err) => console.error('Environmental events fetch error:', err),
    });
  }

  private eventTypeLabel(type: string): string {
    const found = EVENT_TYPES.find((t) => t.id === type);
    return found ? this.translate.instant(found.labelKey) : type;
  }

  columns: TableColumn<EnvironmentalEvent>[] = [
    {
      field: 'title',
      header: 'environmental_calendar.table.event_name',
      type: 'text',
    },
    {
      field: 'event_date',
      header: 'environmental_calendar.table.event_date',
      type: 'date',
    },
    {
      field: 'event_type_label',
      header: 'environmental_calendar.table.event_type',
      type: 'text',
    },
    {
      field: 'status',
      header: 'environmental_calendar.table.status',
      type: 'status',
      statusCallback: (row, value, e) => this.changeStatus(row, value, e),
    },
  ];

  actions: TableAction<EnvironmentalEvent>[] = [
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

  config: TableConfig<EnvironmentalEvent> = {
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
      placeholder: 'environmental_calendar.search_placeholder',
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
      label: 'environmental_calendar.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      anmSeverity: 'expand-gap',
      btnCallback: () => this.showDialog(),
    },
  ];

  showDialog(): void {
    this.currentEventId = undefined;
    this.visible = true;
  }

  edit(row: EnvironmentalEvent): void {
    this.currentEventId = row.id;
    this.visible = true;
  }

  delete(row: EnvironmentalEvent): void {
    this.showDeleteConfirmDialog(row, 'delete');
  }

  showDeleteConfirmDialog(
    data: EnvironmentalEvent | EnvironmentalEvent[],
    actionType: 'delete' | 'bulk-delete',
  ): void {
    const header =
      actionType === 'delete'
        ? 'environmental_calendar.delete_dialog.header'
        : 'environmental_calendar.bulk_delete_dialog.header';
    const count = Array.isArray(data) ? data.length : 0;
    const desc =
      actionType === 'delete'
        ? 'environmental_calendar.delete_dialog.desc'
        : this.translate.instant('environmental_calendar.bulk_delete_dialog.desc', {
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
      (product: { action: string; data: EnvironmentalEvent | EnvironmentalEvent[] }) => {
        if (product?.action === 'confirm') {
          if (!Array.isArray(product.data)) {
            this.service.deleteEvent(product.data.id).subscribe({
              next: () => this.loadEvents(this.paginationObj),
            });
          } else {
            const ids = product.data.map((x) => x.id);
            this.service.bulkDeleteEvents(ids).subscribe(() => {
              this.loadEvents(this.paginationObj);
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
    this.exportService.exportModule('environmental-events');
  }

  changeStatus(row: EnvironmentalEvent, value: boolean, _e?: Event): void {
    this.service.changeEventStatus(row.id, value).subscribe({
      error: () => this.loadEvents(),
    });
  }

  onPaginationChange(event: PaginationObj): void {
    this.paginationObj = event;
    this.loadEvents();
  }

  onFilterChange(filter: { value?: string }): void {
    this.filterObj = filter;
    this.loadEvents();
  }

  selectionChange(e: EnvironmentalEvent[] | EnvironmentalEvent): void {
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
      const withoutBulk = this.filterItems.filter(
        (f) => f.name !== 'delete-btn',
      );
      this.filterItems = [bulkDeleteBtn, ...withoutBulk];
    } else {
      this.filterItems = this.filterItems.filter((f) => f.name !== 'delete-btn');
    }
  }

  bulkDelete(): void {
    this.showDeleteConfirmDialog(this.selectedItems, 'bulk-delete');
  }

  handleFormClose(event: EnvironmentalEventFormEvent): void {
    switch (event.action) {
      case 'save':
        this.submit(event.formData!, 'save');
        break;
      case 'saveAndCreateNew':
        this.submit(event.formData!, 'saveAndCreateNew');
        break;
      case 'cancel':
        this.visible = false;
        this.currentEventId = undefined;
        break;
      default:
        break;
    }
  }

  private submit(
    payload: NonNullable<EnvironmentalEventFormEvent['formData']>,
    action: 'save' | 'saveAndCreateNew',
  ): void {
    const isEdit = !!this.currentEventId;
    const done = () => {
      if (action === 'save') {
        this.visible = false;
      }
      this.currentEventId = undefined;
      this.eventForm?.resetForm();
      this.loadEvents();
    };
    if (isEdit) {
      this.service.updateEvent(this.currentEventId!, payload).subscribe({
        next: () => done(),
        error: (err) => console.error(err),
      });
    } else {
      this.service.createEvent(payload).subscribe({
        next: () => done(),
        error: (err) => console.error(err),
      });
    }
  }

  onDialogHide(): void {
    this.visible = false;
    this.currentEventId = undefined;
    this.eventForm?.resetForm();
  }
}
