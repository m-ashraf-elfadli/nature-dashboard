import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { GalleryUploadComponent } from '../../../shared/components/gallery-upload/gallery-upload.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    FormActionsComponent,
    GalleryUploadComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
  pageTitle: string = 'Add New Project';
  projectForm!: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      beforeImage: [null],
      gallery: [null],
    });
  }
  onDiscard(event: Event) {
    console.log(event);
  }
  onSave(event: Event) {
    console.log(event);
  }
  onLanguageChange(event: Event) {
    console.log(event);
  }
  onFileSelected(event: File | File[]) {
    console.log(event);
  }
  submitForm(form: FormGroup) {
    console.log(form.value);
  }
}
