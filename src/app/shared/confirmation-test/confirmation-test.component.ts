import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ConfirmationDialogConfig } from '../services/confirmation-popup.service';

@Component({
  selector: 'app-confirmation-test',
  standalone: true,
  imports: [ButtonModule, ConfirmDialogComponent],
  template: `
    <div style="padding: 40px; display: flex; gap: 12px;">
      <button pButton label="Delete Project" (click)="openDelete()"></button>
      <button pButton label="Confirm Action" (click)="openConfirm()"></button>
    </div>

    <app-confirm-dialog
      [(visible)]="visible"
      [config]="config"
      (confirm)="onConfirm()"
      (cancel)="onCancel()"
    />
  `
})
export class ConfirmationTestComponent {
  visible = false;
  config!: ConfirmationDialogConfig;

  openDelete() {
    this.config = {
      title: 'Delete Project?',
      subtitle: 'This action can’t be undone.',
      icon: 'images/delete.svg',
      confirmText: 'Delete',
      confirmSeverity: 'danger'
    };
    this.visible = true;
  }

  openConfirm() {
    this.config = {
      title: 'Confirm Action',
      subtitle: 'Do you want to continue?',
      confirmText: 'Yes, Continue',
      confirmSeverity: 'success'
    };
    this.visible = true;
  }

  onConfirm() {
    console.log('CONFIRMED:', this.config.title);
  }

  onCancel() {
    console.log('CANCELLED');
  }
}
