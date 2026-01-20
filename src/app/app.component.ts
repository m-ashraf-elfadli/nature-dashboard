import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationDialogConfig } from './shared/services/confirmation-popup.service';
import { ConfirmationTestComponent } from "./shared/confirmation-test/confirmation-test.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, DialogModule, ConfirmDialogComponent, ConfirmationTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService]
})
export class AppComponent {
showDialog: any;
onDeleteConfirmed() {
throw new Error('Method not implemented.');
}
  deleteDialogConfig :ConfirmationDialogConfig  = {
  title: 'Delete Project?', 
  subtitle: 'This action can’t be undone.',
  icon: 'assets/icons/delete.svg',
  confirmText: 'Delete',
  confirmSeverity: 'danger'
};

  title = 'nature-dashboard';
  ref: DynamicDialogRef | undefined;

    constructor(public dialogService: DialogService) {}
show = false;

onDelete() {
  console.log('Project deleted');
}

    showw() {
        this.ref = this.dialogService.open(ConfirmDialogComponent, { 
          header: 'Select a Product',
          modal:true,
        });
    }
}
