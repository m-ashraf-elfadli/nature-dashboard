import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { SidebarService } from './core/services/sidebar.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    NavbarComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'nature-dashboard';
  sidebarCollapsed = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarCollapsed$.subscribe((collapsed) => {
      this.sidebarCollapsed = collapsed;
    });
  }
}
