import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-actions',
  imports: [SelectModule, FormsModule, CommonModule, TranslateModule],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.scss',
})
export class FormActionsComponent implements OnInit {
  private readonly translate = inject(TranslateService);

  @Input() editMode: boolean = false;
  @Input() isFormValid: boolean = false;
  @Output() discard = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  @Output() languageChange = new EventEmitter<{
    newLang: string;
    oldLang: string;
  }>();

  displayLanguage!: string;
  previousLanguage!: string;

  languages = [
    { code: 'en', label: 'English', flag: './images/usa.webp' },
    { code: 'ar', label: 'العربية', flag: './images/ue.webp' },
  ];

  get selectedLanguage(): string {
    return this.displayLanguage;
  }

  set selectedLanguage(value: string) {
    const oldLang = this.previousLanguage;

    if (value !== oldLang) {
      this.languageChange.emit({
        newLang: value,
        oldLang: oldLang,
      });
    }
  }

  ngOnInit() {
    const storedLang = localStorage.getItem('app_lang');
    const validCodes = this.languages.map((l) => l.code);

    // Use stored value if it exists and is valid, otherwise fall back to first language
    this.displayLanguage =
      storedLang && validCodes.includes(storedLang)
        ? storedLang
        : this.languages[0].code;

    this.previousLanguage = this.displayLanguage;
  }

  onLanguageChange(event: any) {
    this.languageChange.emit({
      newLang: event.value,
      oldLang: this.previousLanguage,
    });
  }

  confirmLanguage(lang: string) {
    this.displayLanguage = lang;
    this.previousLanguage = lang;
  }

  revertLanguage() {
    setTimeout(() => {
      this.displayLanguage = this.previousLanguage;
    }, 0);
  }

  onDiscard(event: Event) {
    this.discard.emit(event);
  }

  onSave(event: Event) {
    this.save.emit(event);
  }

  onLanguageAttempt(event: any) {
    const newLang = event.value;
    const oldLang = this.previousLanguage;

    this.languageChange.emit({
      newLang,
      oldLang,
    });
  }

  getLanguageLabel(code: string): string {
    const lang = this.languages.find((l) => l.code === code);
    return lang ? lang.label : '';
  }
}
