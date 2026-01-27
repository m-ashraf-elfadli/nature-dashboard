import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
export interface ConfirmationDialogConfig<T> {
  title: string;
  subtitle?: string;
  icon?: string;
  iconBgColor?: string;
  iconBorderColor?: string;
  confirmText?: string;
  extraButtonText?: string;
  extraButtonSeverity?: 'delete' | 'cancel' | 'success' | 'warning';
  cancelText?: string;
  confirmSeverity?: 'delete' | 'cancel' | 'success' | 'warning';
  cancelSeverity?: 'delete' | 'cancel' | 'success' | 'warning';
  showCancel?: boolean;
  showExtraButton?: boolean;
  data?: T;
}
@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  product = { name: 'Sample Product' };
  data: any = null;

  constructor(
    public ref: DynamicDialogRef,
    public configs: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    this.data = this.configs?.data ?? null;
    if (this.data) {
      if (this.data.name) {
        this.product.name = this.data.name;
      } else if (this.data.id) {
        this.product.name = `ID: ${this.data.id}`;
      }
    }
  }

  confirm() {
    this.ref.close({ action: 'confirm', data: this.data.data });
  }

  elseAction() {
    this.ref.close({ action: 'else', data: this.data.data });
  }

  close() {
    this.ref.close();
  }
}
