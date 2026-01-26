import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputText } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageModule } from 'primeng/message';
import { EditorModule } from 'primeng/editor';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { DropDownOption } from '../../../../core/models/global.interface';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    FormActionsComponent,
    TranslateModule,
    TextareaModule,
    ReactiveFormsModule,
    InputText,
    MultiSelectModule,
    SelectModule,
    DatePickerModule,
    ToggleSwitchModule,
    EditorModule,
    GalleryUploadComponent,
    SettingsComponent,
    MessageModule
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private cachedResults: any[] = [];
  private cachedMetrics: any[] = [];
  services: DropDownOption[] = [
    { name: 'Conservation', id: 1 },
    { name: 'Reforestation', id: 2 },
  ];
  countries: DropDownOption[] = [
    { name: 'Kenya', id: 1 },
    { name: 'Uganda', id: 2 },
  ];
  metricCases: DropDownOption[] = [
    { name: 'Plus', id: 1 },
    { name: 'Minus', id: 2 },
  ];
  form!: FormGroup;

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      brief: ['', [Validators.required, Validators.maxLength(200)]],
      overview: ['', [Validators.required, Validators.maxLength(200)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      service_ids: [[], Validators.required],
      image_before: [null],
      image_after: [null],
      gallery: [],
      city_id: [{ value: null, disabled: true }, Validators.required],
      country_id: ['', Validators.required],
      status:[1,Validators.required],
      // Toggles
      enableResults: [false],
      enableMetrics: [false],
      // form arrays
      results: this.fb.array([]),
      metrics: this.fb.array([]),
    });
  }
  get results(): FormArray {
    return this.form.get('results') as FormArray;
  }

  get metrics(): FormArray {
    return this.form.get('metrics') as FormArray;
  }
  createResult(data?: any): FormGroup {
    return this.fb.group({
      section_title: [data?.section_title || '', Validators.required],
      section_body: [data?.section_body || '', Validators.required],
    });
  }

  createMetric(data?: any): FormGroup {
    return this.fb.group({
      metric_title: [data?.metric_title || '', Validators.required],
      metric_number: [
        data?.metric_number || '',
        [Validators.required, Validators.max(100)],
      ],
      metric_case: [data?.metric_case || '', Validators.required],
    });
  }
  toggleResults() {
    if (!this.form.get('enableResults')?.value) {
      // 🔴 TOGGLE OFF → CACHE & CLEAR
      this.cachedResults = this.results.value;
      this.results.clear();
    } else {
      // 🟢 TOGGLE ON → RESTORE
      if (this.cachedResults.length) {
        this.cachedResults.forEach((r) =>
          this.results.push(this.createResult(r)),
        );
      } else {
        // optional: add empty row
        this.results.push(this.createResult());
      }
    }
  }
  toggleMetrics() {
    if (!this.form.get('enableMetrics')?.value) {
      this.cachedMetrics = this.metrics.value;
      this.metrics.clear();
    } else {
      if (this.cachedMetrics.length) {
        this.cachedMetrics.forEach((m) =>
          this.metrics.push(this.createMetric(m)),
        );
      } else {
        this.metrics.push(this.createMetric());
      }
    }
  }

  hasError(controlName: string, errorName?: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;
    if (errorName) {
    return !!(
    control.touched &&
    control.invalid &&
    control.hasError(errorName)
    );
    }
    return !!(control.touched && control.invalid);
  }

  addResult() {
    this.results.push(this.createResult());
  }

  removeResult(index: number) {
    this.results.removeAt(index);
  }

  addMetric() {
    this.metrics.push(this.createMetric());
  }

  removeMetric(index: number) {
    this.metrics.removeAt(index);
  }
  onDiscard(event: Event) {
    console.log(event);
  }
  onSave(event: Event) {
    console.log(this.form.value)
    this.form.markAllAsTouched();
  }
  onLanguageChange(event: Event) {
    console.log(event);
  }
  onFileSelected(event: File | File[]) {
    console.log(event);
  }
  submitForm() {
    console.log(this.form.value);
  }
}
