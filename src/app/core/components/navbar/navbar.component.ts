import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../services/sidebar.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);

  userMenuVisible = false;
  currentPageTitle = '';
  mobileMenuOpen = false;

  private pageMap: { [key: string]: string } = {
    dashboard: 'navigation.dashboard',
    clients: 'navigation.clients',
    projects: 'navigation.projects',
    services: 'navigation.services',
    awards: 'navigation.awards',
    testimonials: 'navigation.testimonials',
  };
  private readonly LANG_KEY = 'app_lang';

  languages: { code: string; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: './images/usa.webp' },
    { code: 'ar', label: 'العربية', flag: './images/eg.webp' },
  ];
  selectedLanguage!: string;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
  ) {}

  changeLang(lang: string) {
    this.selectedLanguage = lang;
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
    this.selectedLanguage = savedLang;

    this.translate.use(savedLang);
    this.setDirection(savedLang);

    // 🔥 يتحدث عند تغيير اللغة
    this.translate.onLangChange.subscribe(() => {
      this.updatePageTitle();
    });

    // 🔥 يتحدث عند تغيير الصفحة
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });

    this.sidebarService.mobileMenuOpen$.subscribe((state) => {
      this.mobileMenuOpen = state;
    });
  }

  private updatePageTitle() {
    const url = this.router.url.split('/').pop() || 'dashboard';
    const translationKey = this.pageMap[url] || 'navigation.dashboard';

    this.translate.get(translationKey).subscribe((title) => {
      this.currentPageTitle = title;
    });
  }
  toggleUserMenu() {
    this.userMenuVisible = !this.userMenuVisible;
  }

  toggleMobileMenu() {
    this.sidebarService.toggleMobileMenu();
  }

  onLogout(event: Event) {
    event.preventDefault();
    this.userMenuVisible = false;

    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/auth']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.router.navigate(['/auth']);
      },
    });
  }
}
