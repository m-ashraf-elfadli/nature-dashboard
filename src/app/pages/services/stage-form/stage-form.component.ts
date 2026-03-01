import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { GalleryUploadComponent } from '../../../shared/components/gallery-upload/gallery-upload.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    InputText,
    GalleryUploadComponent,
    TranslateModule,
  ],
  templateUrl: './stage-form.component.html',
  styleUrl: './stage-form.component.scss',
})
export class StageFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  rowData: any = null;
  imageRemoved = false;

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
      image: [null, Validators.required],
      imagePreview: [null],
    });

    // Check if we're in edit mode (data passed from dialog)
    if (this.config.data?.rowData) {
      this.isEditMode = true;
      this.rowData = this.config.data.rowData;

      // Pre-fill the form with row data
      this.form.patchValue({
        title: this.rowData.title,
        description: this.rowData.description,
      });

      // Handle image preview separately for gallery-upload component
      if (this.rowData.imagePreview) {
        this.form.get('image')?.setValue(this.rowData.imagePreview);
        this.form.get('image')?.clearValidators();
        this.form.get('image')?.updateValueAndValidity();
      }
    }
  }

  onImageRemoved() {
    this.imageRemoved = true;
    this.form.patchValue({
      image: null,
      imagePreview: null,
    });
    // Re-add required validator when image is removed
    if (!this.isEditMode || this.imageRemoved) {
      this.form.get('image')?.setValidators([Validators.required]);
      this.form.get('image')?.updateValueAndValidity();
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return this.translate.instant(
        `services.stage_form.${fieldName}_required`,
      );
    }
    if (control.errors['minlength']) {
      return this.translate.instant(`services.stage_form.${fieldName}_min`);
    }
    if (control.errors['maxlength']) {
      return this.translate.instant(`services.stage_form.${fieldName}_max`);
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

    if (this.isEditMode) {
      // if (this.imageRemoved) {
      //   // User removed the image → prefer null
      //   formValue.image = null;
      //   formValue.imagePreview = null;
      //   this.returnFormData(formValue);
      //   return;
      // }

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
    // For edit mode, include the index so we know which row to update
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
