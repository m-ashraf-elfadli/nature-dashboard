import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    InputText,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './value-form.component.html',
  styleUrl: './value-form.component.scss',
})
export class ValueFormComponent {
  constructor(private fb: FormBuilder, private ref: DynamicDialogRef) {}

  form!: FormGroup;
  toolInput = '';

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      toolsUsed: this.fb.array([]),
    });
  }

  get toolsUsedArray(): FormArray {
    return this.form.get('toolsUsed') as FormArray;
  }

  addTool(): void {
    if (this.toolInput.trim()) {
      this.toolsUsedArray.push(this.fb.control(this.toolInput.trim()));
      this.toolInput = '';
    }
  }

  removeTool(index: number): void {
    this.toolsUsedArray.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      this.ref.close(this.form.value);
    }
  }
}
