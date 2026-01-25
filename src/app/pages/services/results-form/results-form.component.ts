import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
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
  templateUrl: './results-form.component.html',
  styleUrl: './results-form.component.scss',
})
export class ResultsFormComponent {
  constructor(private fb: FormBuilder, private ref: DynamicDialogRef) {}

  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
    });
  }

  submit() {
    if (this.form.valid) {
      this.ref.close(this.form.value);
    }
  }
}
