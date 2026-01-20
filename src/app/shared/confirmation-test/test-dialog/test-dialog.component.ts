import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-test-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './test-dialog.component.html',
  styleUrls: ['./test-dialog.component.scss']
})
export class TestDialogComponent {
  product = { name: 'Sample Product' };
  data: any = null;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.data = this.config?.data ?? null;
    if (this.data) {
      if (this.data.name) {
        this.product.name = this.data.name;
      } else if (this.data.id) {
        this.product.name = `ID: ${this.data.id}`;
      }
    }
  }

  confirm() {
    this.ref.close(this.data);
  }

  elseAction() {
    this.ref.close({ name: 'Else Action' });
  }

  close() {
    this.ref.close();
  }

}
