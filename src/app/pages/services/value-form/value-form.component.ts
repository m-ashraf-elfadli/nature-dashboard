import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './value-form.component.html',
  styleUrl: './value-form.component.scss',
})
export class ValueFormComponent implements OnInit {
  form!: FormGroup;
  toolInput = '';
  isEditMode = false;
  rowData: any = null;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tools: this.fb.array([]),
    });

    // EDIT MODE
    if (this.config.data?.rowData) {
      this.isEditMode = true;
      this.rowData = this.config.data.rowData;

      this.form.patchValue({
        title: this.rowData.title,
        description: this.rowData.description,
      });

      // populate tools array
      if (this.rowData.tools && Array.isArray(this.rowData.tools)) {
        this.rowData.tools.forEach((tool: string) =>
          this.toolsArray.push(this.fb.control(tool)),
        );
      }
    }
  }

  get toolsArray(): FormArray {
    return this.form.get('tools') as FormArray;
  }

  addTool(): void {
    if (this.toolInput.trim()) {
      this.toolsArray.push(this.fb.control(this.toolInput.trim()));
      this.toolInput = '';
    }
  }

  removeTool(index: number): void {
    this.toolsArray.removeAt(index);
  }

  submit() {
    if (!this.form.valid) return;

    const formValue = { ...this.form.value };

    if (this.isEditMode && this.config.data?.index !== undefined) {
      this.ref.close({
        ...formValue,
        rowData: formValue,
        index: this.config.data.index,
      });
    } else {
      this.ref.close(formValue);
    }
  }

  cancel() {
    this.ref.close();
  }
}
