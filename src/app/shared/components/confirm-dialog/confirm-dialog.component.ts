import { Component, OnInit } from '@angular/core';
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
  extraButtonText?: string;
  data?: T;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements OnInit {
  data: any = null;

  constructor(
    public ref: DynamicDialogRef, 
    public configs: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    // The entire config is passed as configs.data
    this.data = this.configs?.data ?? null;
    console.log('Confirm dialog initialized with data:', this.data);
  }

  confirm() {
    // Return the actual data object (the testimonial)
    console.log('Confirming with data:', this.data?.data);
    this.ref.close(this.data?.data);
  }

  elseAction() {
    this.ref.close({ name: 'Else Action' });
  }

  close() {
    this.ref.close();
  }
}