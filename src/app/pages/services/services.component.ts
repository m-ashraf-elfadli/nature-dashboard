import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, Button, PageHeaderComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  private router = inject(Router);

  addNew() {
    this.router.navigate(['/services/add']);
  }
}
