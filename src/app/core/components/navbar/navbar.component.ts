import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  userMenuVisible = false;
  currentPageTitle = 'Dashboard';
  mobileMenuOpen = false;

  private pageMap: { [key: string]: string } = {
    dashboard: 'Dashboard',
    clients: 'Clients',
    projects: 'Projects',
    services: 'Services',
    awards: 'Awards',
    testimonials: 'Testimonials',
  };

  constructor(private router: Router, private sidebarService: SidebarService) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url.split('/').pop() || 'dashboard';
      this.currentPageTitle = this.pageMap[url] || 'Dashboard';
    });

    this.sidebarService.mobileMenuOpen$.subscribe((state) => {
      this.mobileMenuOpen = state;
    });
  }

  toggleUserMenu() {
    this.userMenuVisible = !this.userMenuVisible;
  }

  toggleMobileMenu() {
    this.sidebarService.toggleMobileMenu();
  }
}
