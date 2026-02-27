import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
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
import {
  ConfirmDialogComponent,
  ConfirmationDialogConfig,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationObj } from '../../../../core/models/global.interface';
import { Question, QuestionFormEvent } from '../../models/questions.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientFormActions } from '../../../clients/models/clients.model';
import { QuestionsFormComponent } from '../questions-form/questions-form.component';
import { QuestionsService } from '../../services/questions.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-questions',
  imports: [
    PageHeaderComponent,
    ReusableTableComponent,
    DialogModule,
    ButtonModule,
    QuestionsFormComponent,
    TranslateModule,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsComponent implements OnInit, OnDestroy {
  @ViewChild(ReusableTableComponent) reusableTableComponent!: ReusableTableComponent<Question>;
  @ViewChild(QuestionsFormComponent)
  questionForm?: QuestionsFormComponent;

  private service = inject(QuestionsService);
  private dialogService = inject(DialogService);
  private translate = inject(TranslateService);
  private langChangeSubscription?: Subscription;

  visible = false;
  data: Question[] = [];
  selectedItems: Question | Question[] = []
  totalRecords = 0;
  currentQuestionId?: string;
  confirmDialogRef?: DynamicDialogRef;
  paginationObj: PaginationObj = {
    page: 1,
    size: 10,
  };
  filterObj: any;
  emptyStateInfo = {
    label: 'empty_state.questions.create_btn',
    description: 'empty_state.questions.no_data',
    callback: () => this.showDialog(),
  };

  ngOnInit() {
    this.loadQuestions();

    // Reload data when language changes
    this.langChangeSubscription = this.translate.onLangChange.subscribe((_) => {
      this.loadQuestions();
    });
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    this.langChangeSubscription?.unsubscribe();
  }

  loadQuestions(pagination?: PaginationObj) {
    const pag = pagination || this.paginationObj;
    this.service.getAll(pag, this.filterObj?.value || '').subscribe({
      next: (res) => {
        this.data = res.result || [];
        this.totalRecords = res.total;
      },
      error: (err) => console.error('Questions fetch error:', err),
    });
  }

  columns: TableColumn<Question>[] = [
    {
      field: 'question',
      header: 'questions.list.table_headers.question',
      type: 'text',
    },
    {
      field: 'created_at',
      header: 'general.date_added',
      type: 'date',
    },
    {
      field: 'status',
      header: 'questions.list.table_headers.status',
      type: 'status',
      statusCallback: (row: Question, value: boolean, e: Event) =>
        this.changeStatus(row, value, e),
    },
  ];

  actions: TableAction<Question>[] = [
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

  config: TableConfig<Question> = {
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
      placeholder: 'general.search_input_table_placeholder',
    },
    {
      type: 'btn',
      label: 'general.import',
      btnIcon: 'pi pi-download',
      btnSeverity: 'white',
      anmSeverity: 'bg-grow',
    },
    {
      type: 'btn',
      label: 'questions.list.btns.add_new',
      btnIcon: 'pi pi-plus',
      btnSeverity: 'primary',
      anmSeverity: 'expand-gap',
      btnCallback: () => this.showDialog(),
    },

  ];

  showDialog() {
    this.currentQuestionId = undefined;
    this.visible = true;
  }

  edit(row: Question) {
    this.currentQuestionId = row.id;
    this.visible = true;
  }

  delete(row: Question, event?: Event) {
    this.showDeleteConfirmDialog(row, 'delete');
  }

  private performDelete(id: string) {
    this.service.delete(id).subscribe({
      next: () => {
        this.loadQuestions();
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Failed to delete question');
      },
    });
  }
  showDeleteConfirmDialog(dataToDelete: Question | Question[], actionType: 'delete' | 'bulk-delete' = 'delete') {
    const header =
      actionType === 'delete'
        ? 'questions.list.delete_dialog.header'
        : this.translate.instant('questions.list.bulk_delete_dialog.header');
    const count = Array.isArray(dataToDelete) ? dataToDelete.length : 0;
    const desc =
      actionType === 'delete'
        ? 'questions.list.delete_dialog.desc'
        : this.translate.instant('questions.list.bulk_delete_dialog.desc', { count });
    const data = dataToDelete;
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
        data: data,
      },
    });
    this.confirmDialogRef.onClose.subscribe((product: { action: string; data: Question | Question[] }) => {
      if (product && product.action === 'confirm') {
        if (!Array.isArray(product.data)) {
          this.service.delete(product.data.id).subscribe({
            next: () => {
              this.loadQuestions(this.paginationObj);
            },
          });
        } else {
          const ids = product.data.map((a: Question) => a.id);
          this.service.bulkDelete(ids).subscribe((_) => {
            this.loadQuestions(this.paginationObj);
            this.reusableTableComponent.selection = [];
            this.selectedItems = [];
            this.addAndHideBulkDeleteBtn();
          });
        }
      }
    });
  }

  changeStatus(row: Question, value: boolean, e: Event) {
    this.service.changeStatus(row.id, value).subscribe();
  }

  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event;
    this.loadQuestions();
  }

  onFilterChange(filter: any) {
    this.filterObj = filter;
    this.loadQuestions();
  }
  selectionChange(e: Question[] | Question) {
    this.selectedItems = Array.isArray(e) ? e : [e]
    this.addAndHideBulkDeleteBtn();
  }
  addAndHideBulkDeleteBtn() {
    const hasSelection = Array.isArray(this.selectedItems) && this.selectedItems.length > 0;
    const bulkDeleteBtn: FilterItems = {
      label: 'general.delete_selected',
      type: 'btn',
      name: 'delete-btn',
      btnIcon: "pi pi-trash",
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
  bulkDelete() {
    this.showDeleteConfirmDialog(this.selectedItems, 'bulk-delete')
  }

  handleFormClose(event: QuestionFormEvent) {
    console.log('Form closed with action:', event.action);

    switch (event.action) {
      case 'save':
        this.handleSave(event.formData);
        break;

      case 'saveAndCreateNew':
        this.handleSaveAndCreateNew(event.formData);
        break;

      case 'cancel':
        this.visible = false;
        this.currentQuestionId = undefined;
        break;

      default:
        return;
    }
  }

  submitForm(payload: any, isEditMode: boolean, action: ClientFormActions) {
    if (isEditMode) {
      this.service.update(this.currentQuestionId!, payload).subscribe({
        next: () => {
          if (action === 'save') {
            this.visible = false;
          }
          this.currentQuestionId = undefined;
          this.questionForm?.resetForm();
          this.loadQuestions();
        },
        error: (err) => {
          console.error('❌ Update error:', err);
        },
      });
    } else {
      // Create new
      this.service.create(payload).subscribe({
        next: (res) => {
          if (action === 'save') {
            this.visible = false;
          }
          this.currentQuestionId = undefined;
          this.questionForm?.resetForm();
          this.loadQuestions();
        },
        error: (err) => {
          console.error('❌ Create error:', err);
        },
      });
    }
  }


  private handleSave(payload: any) {
    this.submitForm(payload, !!this.currentQuestionId, 'save');
  }

  private handleSaveAndCreateNew(payload: any) {
    this.submitForm(payload, !!this.currentQuestionId, 'saveAndCreateNew');
  }

  onDialogHide() {
    this.visible = false;
    this.currentQuestionId = undefined;
    this.questionForm?.resetForm();
  }
}
