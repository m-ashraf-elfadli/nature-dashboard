import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    FormsModule,
    TranslateModule,
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
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
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

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return this.translate.instant(
        `services.value_form.${fieldName}_required`,
      );
    }
    if (control.errors['minlength']) {
      return this.translate.instant(`services.value_form.${fieldName}_min`);
    }
    if (control.errors['maxlength']) {
      return this.translate.instant(`services.value_form.${fieldName}_max`);
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  submit() {
    if (!this.form.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

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
