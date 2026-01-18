import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, Button, PageHeaderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private router = inject(Router);

  addNew() {
    this.router.navigate(['/projects/add']);
  }
}
