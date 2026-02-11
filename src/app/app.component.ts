import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from './core/components/loader/loader.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, DialogModule, LoaderComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService],
})
export class AppComponent implements OnInit{
  private readonly translate = inject(TranslateService)

  selectedLanguage!:string;
  ngOnInit(): void {
    const savedLang = localStorage.getItem('app_lang') || 'en';
    this.selectedLanguage = savedLang;
    this.translate.use(savedLang);
    this.setDirection(savedLang);
  }
  private setDirection(lang: string) {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
  
}
