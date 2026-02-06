import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from './core/components/loader/loader.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, DialogModule, LoaderComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService],
})
export class AppComponent {
  title = 'nature-dashboard';
}
