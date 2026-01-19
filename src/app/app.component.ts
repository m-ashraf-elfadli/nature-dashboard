import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-root',
  imports: [ButtonModule,TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'nature-dashboard';
  private readonly LANG_KEY = 'app_lang';

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem(this.LANG_KEY) || 'en';

    this.translate.use(savedLang);
    this.setDirection(savedLang);
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem(this.LANG_KEY, lang);
    this.setDirection(lang);
  }

  private setDirection(lang: string) {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}
