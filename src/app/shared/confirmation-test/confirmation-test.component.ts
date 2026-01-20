import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ConfirmationDialogConfig } from '../services/confirmation-popup.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TestDialogComponent } from './test-dialog/test-dialog.component';

@Component({
  selector: 'app-confirmation-test',
  standalone: true,
  imports: [ButtonModule, ConfirmDialogComponent],
  templateUrl: './confirmation-test.component.html',
  styleUrl: './confirmation-test.component.scss',
  providers: [DialogService, MessageService]
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

   ref: DynamicDialogRef | undefined;

    constructor(public dialogService: DialogService, public messageService: MessageService) {}

    show() {
        this.ref = this.dialogService.open(TestDialogComponent, {
            header: '',
            width: '70%',
            data: {
                id: '51gF3'
            },
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false,
            modal: true
        });

        this.ref.onClose.subscribe((product: any) => {
            if (product) {
              console.log('Product selected:', product);
                // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
            }
        });
    }
}
