import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-form-actions',
  imports: [SelectModule, FormsModule, CommonModule],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.scss',
})
export class FormActionsComponent {
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
    { code: 'ar', label: 'العربية', flag: './images/eg.webp' },
  ];

  // This computed property returns the display value
  get selectedLanguage(): string {
    return this.displayLanguage;
  }

  set selectedLanguage(value: string) {
    // This setter is called by ngModel when user selects
    // We intercept it here
    const oldLang = this.previousLanguage;

    // Don't update displayLanguage yet - keep it at old value
    // Just emit the change request
    if (value !== oldLang) {
      this.languageChange.emit({
        newLang: value,
        oldLang: oldLang,
      });
    }
  }

  ngOnInit() {
    this.displayLanguage = this.languages[0].code;
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

  /**
   * Called by parent to revert language selection when validation fails
   */

  onLanguageAttempt(event: any) {
    const newLang = event.value;
    const oldLang = this.previousLanguage;

    // Ask parent if switch is allowed
    this.languageChange.emit({
      newLang,
      oldLang,
    });
  }
}
