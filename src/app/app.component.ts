import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
}
