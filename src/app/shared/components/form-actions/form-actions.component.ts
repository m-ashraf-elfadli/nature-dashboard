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
  @Output() discard = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  @Output() languageChange = new EventEmitter<any>();

  ngOnInit() {
    this.selectedLanguage = this.languages[0]?.code;
  }

  onDiscard(event: Event) {
    this.discard.emit(event);
  }
  onSave(event: Event) {
    this.save.emit(event);
  }

  onLanguageChange(event: any) {
    console.log(event);
    this.languageChange.emit(event);
  }
  languages: { code: string; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: './images/usa.webp' },
    { code: 'ar', label: 'العربية', flag: './images/eg.webp' },
  ];
  selectedLanguage!: string;
}
