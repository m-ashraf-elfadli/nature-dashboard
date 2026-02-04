import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-state',
  imports: [TranslateModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() title?: string = 'empty_state.title';
  @Input() description?: string =
    'No Data to preview, start create your first project to appear here!';
  @Input() buttonLabel?: string = 'Create New Project';

  @Output() buttonAction = new EventEmitter<void>();

  onButtonClick() {
    this.buttonAction.emit();
  }
}
