import { Component, EventEmitter, Input, Output  } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationDialogConfig } from '../../services/confirmation-popup.service';

@Component({
  selector: 'app-confirm-dialog',
    imports: [DialogModule,ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
    @Input() visible = false;
    @Input() config!: ConfirmationDialogConfig;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  close() {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
    this.visibleChange.emit(false);
  }

  get severityClass() {
    return {
      danger: 'confirm-danger',
      primary: 'confirm-primary',
      success: 'confirm-success',
      warning: 'confirm-warning'
    }[this.config.confirmSeverity ?? 'primary'];
  }
}
