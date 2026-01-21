import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
export interface ConfirmationDialogConfig<T> {
  title: string;
  subtitle?: string;
  icon?: string;               
  iconBgColor?: string;        
  iconBorderColor?: string;
  confirmText?: string;
  cancelText?: string;
  confirmSeverity?: 'delete' | 'cancel' | 'extra' | 'warning';
  cancelSeverity?: 'delete' | 'cancel' | 'extra' | 'warning';
  showCancel?: boolean;
  showExtraButton?: boolean;
  data?: T;
}
@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  product = { name: 'Sample Product' };
  data: any = null;

  constructor(public ref: DynamicDialogRef, public configs: DynamicDialogConfig) {}

  ngOnInit(): void {
    // this.data = this.configs?.data ?? null;
    this.data = this.configs?.data ?? null;
    console.log('data name:', this.data);
    if (this.data) {
      if (this.data.name) {
        this.product.name = this.data.name;
      } else if (this.data.id) {
        this.product.name = `ID: ${this.data.id}`;
      }
    }
  }

  confirm() {
    this.ref.close(this.data);
  }

  elseAction() {
    this.ref.close({ name: 'Else Action' });
  }

  close() {
    this.ref.close();
  }

}
