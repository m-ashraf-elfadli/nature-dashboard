import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({ providedIn: 'root' })
export class AppDialogService {
  constructor(private dialog: DialogService) {}

  open(component: any, config: any = {}): DynamicDialogRef {
    return this.dialog.open(component, {
      width: '600px',
      modal: true,
      closable: true,
      dismissableMask: true,
      styleClass: 'form-dialog',
      ...config,
    });
  }
}
