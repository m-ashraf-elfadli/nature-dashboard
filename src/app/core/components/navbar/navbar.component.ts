import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../services/sidebar.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, SelectModule, FormsModule],
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
  private readonly LANG_KEY = 'app_lang';

  languages: { code: string; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: './images/usa.webp' },
    { code: 'ar', label: 'العربية', flag: './images/eg.webp' },
  ];
  selectedLanguage!: string;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private sidebarService: SidebarService
  ) {}
  
  changeLang(lang: string) {
    this.selectedLanguage = this.languages.find(l => l.code === lang)?.code || this.languages[0]?.code;
    this.translate.use(lang);
    localStorage.setItem(this.LANG_KEY, lang);
    this.setDirection(lang);
  }
  
  private setDirection(lang: string) {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  ngOnInit() {
    const savedLang = localStorage.getItem(this.LANG_KEY) || 'en';
    this.selectedLanguage = this.languages.find(l => l.code === savedLang)?.code || this.languages[0]?.code;
    this.translate.use(savedLang);
    this.setDirection(savedLang);
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
