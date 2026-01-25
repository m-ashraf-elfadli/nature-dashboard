import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-empty-state-action',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './empty-state-action.component.html',
  styleUrl: './empty-state-action.component.scss',
})
export class EmptyStateActionComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() buttonLabel = 'Add';
  @Input() icon = 'pi pi-plus';

  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}
