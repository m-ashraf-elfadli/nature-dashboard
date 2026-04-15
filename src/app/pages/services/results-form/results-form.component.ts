import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { GalleryUploadComponent } from '../../../shared/components/gallery-upload/gallery-upload.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TrimInputDirective } from '../../../core/directives/trim-input.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    InputText,
    GalleryUploadComponent,
    TranslateModule,
    TrimInputDirective
  ],
  templateUrl: './results-form.component.html',
  styleUrl: './results-form.component.scss',
})
export class ResultsFormComponent implements OnInit {
  form!: FormGroup;
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
          Validators.maxLength(70),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(215),
        ],
      ],
      image: [null, Validators.required],
      imagePreview: [null],
    });

    if (this.config.data?.rowData) {
      this.isEditMode = true;
      this.rowData = this.config.data.rowData;

      this.form.patchValue({
        title: this.rowData.title,
        description: this.rowData.description,
      });

      if (this.rowData.imagePreview) {
        this.form.get('image')?.setValue(this.rowData.imagePreview);
        this.form.get('imagePreview')?.setValue(this.rowData.imagePreview);
        this.form.get('image')?.clearValidators();
        this.form.get('image')?.updateValueAndValidity();
      }
    }
  }

  onImageRemoved() {
    this.form.patchValue({
      image: null,
      imagePreview: null,
    });
    this.form.get('image')?.setValidators([Validators.required]);
    this.form.get('image')?.updateValueAndValidity();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !(control.dirty || control.touched))
      return '';

    if (control.errors['required']) {
      return this.translate.instant(
        `services.result_form.${fieldName}_required`,
      );
    }
    if (control.errors['minlength']) {
      return this.translate.instant(`services.result_form.${fieldName}_min`);
    }
    if (control.errors['maxlength']) {
      return this.translate.instant(`services.result_form.${fieldName}_max`);
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched));
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

    if (this.isEditMode) {
      const image = formValue.image;
      if (typeof image === 'string' && image === this.rowData.imagePreview) {
        formValue.imagePreview = this.rowData.imagePreview;
        this.returnFormData(formValue);
        return;
      }

      if (image instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          formValue.imagePreview = e.target?.result as string;
          this.returnFormData(formValue);
        };
        reader.readAsDataURL(image);
        return;
      }
    }

    this.returnFormData(formValue);
  }

  private returnFormData(formValue: any): void {
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
