import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService]
})
export class AppComponent {
  title = 'nature-dashboard';
  ref: DynamicDialogRef | undefined;

    constructor(public dialogService: DialogService) {}

    show() {
        this.ref = this.dialogService.open(ConfirmDialogComponent, { 
          header: 'Select a Product',
          modal:true,
        });
    }
}
