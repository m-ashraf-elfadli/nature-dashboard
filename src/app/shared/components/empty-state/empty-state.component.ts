import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() title: string = 'No Data to preview yet!';
  @Input() description: string =
    'No Data to preview, start create your first project to appear here!';
  @Input() buttonLabel: string = 'Create New Project';

  @Output() buttonAction = new EventEmitter<void>();

  onButtonClick() {
    this.buttonAction.emit();
  }
}
