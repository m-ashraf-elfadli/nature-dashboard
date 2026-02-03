import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { GalleryUploadComponent } from '../../../shared/components/gallery-upload/gallery-upload.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FileUploadModule,
    InputText,
    GalleryUploadComponent,
  ],
  templateUrl: './stage-form.component.html',
  styleUrl: './stage-form.component.scss',
})
export class StageFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {}

  form!: FormGroup;
  isEditMode = false;
  rowData: any = null;
  imageRemoved = false;

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
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
      }
    }
  }

  onImageRemoved() {
    this.imageRemoved = true;
    this.form.patchValue({
      image: null,
      imagePreview: null,
    });
  }
  submit() {
    if (!this.form.valid) return;

    const formValue = { ...this.form.value };

    if (this.isEditMode) {
      if (this.imageRemoved) {
        // المستخدم مسح الصورة → نفضّل null
        formValue.image = null;
        formValue.imagePreview = null;
        this.returnFormData(formValue);
        return;
      }

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
