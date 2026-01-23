import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export type MiniTableColumnType = 'text' | 'action';

export interface MiniTableColumn {
  field: string;
  header: string;
  type?: MiniTableColumnType;
}

@Component({
  selector: 'app-mini-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './mini-table.component.html',
  styleUrl: './mini-table.component.scss',
})
export class MiniTableComponent {
  @Input() data: any[] = [];
  @Input() columns: MiniTableColumn[] = [];

  @Input() reorderable = false;

  @Input() showImage = false;
  @Input() imageField = 'image';

  @Output() rowDeleted = new EventEmitter<number>();
  @Output() reordered = new EventEmitter<any[]>();

  onDelete(index: number) {
    this.data = this.data.filter((i) => i !== index);
    this.rowDeleted.emit(index);
  }

  onRowReorder(event: any) {
    this.reordered.emit(event);
  }
}
