import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-form-actions',
  imports: [],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.scss',
})
export class FormActionsComponent {
  @Output() discard = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  @Output() languageChange = new EventEmitter<any>();

  onDiscard(event: Event) {
    this.discard.emit(event);
  }
  onSave(event: Event) {
    this.save.emit(event);
  }
  onLanguageChange(event: Event) {
    this.languageChange.emit(event);
  }
}
