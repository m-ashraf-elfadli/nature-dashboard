import { Injectable } from '@angular/core';
export interface ConfirmationDialogConfig {
  title: string;
  subtitle?: string;

  icon?: string;               
  iconBgColor?: string;        
  iconBorderColor?: string;

  confirmText?: string;
  cancelText?: string;

  confirmSeverity?: 'danger' | 'primary' | 'success' | 'warning';

  showCancel?: boolean;
}
@Injectable({
  providedIn: 'root'
})

export class ConfirmationPopupService {

  constructor() { }
}
