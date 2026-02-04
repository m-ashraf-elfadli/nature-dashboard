import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AppDialogService } from '../../services/dialog.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export type MiniTableColumnType = 'text' | 'delete-action' | 'edit-action';

export interface MiniTableColumn {
  field: string;
  header: string;
  type?: MiniTableColumnType;
}

@Component({
  selector: 'app-mini-table',
  standalone: true,
  imports: [CommonModule, TableModule, TranslateModule],
  templateUrl: './mini-table.component.html',
  styleUrl: './mini-table.component.scss',
})
export class MiniTableComponent {
  private dialogService = inject(AppDialogService);

  @Input() data: any[] = [];
  @Input() columns: MiniTableColumn[] = [];

  @Input() reorderable = false;

  @Input() showImage = false;
  @Input() imageField = 'image';

  @Input() editComponent: any;
  @Input() editDialogConfig: any = {};

  @Output() rowDeleted = new EventEmitter<number>();
  @Output() rowEdited = new EventEmitter<any>();
  @Output() reordered = new EventEmitter<any[]>();

  onDelete(index: number) {
    this.data = this.data.filter((i) => i !== index);
    this.rowDeleted.emit(index);
  }

  onEdit(row: any, index: number) {
    if (!this.editComponent) {
      console.warn('Edit component not provided');
      return;
    }

    const dialogRef = this.dialogService.open(this.editComponent, {
      ...this.editDialogConfig,
      data: {
        rowData: row,
        index: index,
      },
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.rowEdited.emit(result);
      }
    });
  }

  onRowReorder(event: any) {
    // Emit the reordered data array
    this.reordered.emit(this.data);
  }
  get textColumns() {
    return this.columns.slice(1).filter((c) => !c.type || c.type === 'text');
  }

  get actionColumns() {
    return this.columns
      .slice(1)
      .filter((c) => c.type === 'edit-action' || c.type === 'delete-action');
  }
}
