import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { ProjectsService } from '../../services/projects.service';
import { forkJoin } from 'rxjs';

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
    MessageModule,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
  private readonly service = inject(ProjectsService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private cachedResults: any[] = [];
  private cachedMetrics: any[] = [];
  services: DropDownOption[] = [];
  countries: DropDownOption[] = [];
  metricCases: DropDownOption[] = [
    { name: 'general.up', id: 'up' },
    { name: 'general.down', id: 'down' },
    { name: 'general.stable', id: 'stable' },
  ];
  cities: DropDownOption[] = [];

  form!: FormGroup;

  ngOnInit() {
    this.getDropDowns();
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
      status: [1, Validators.required],
      // Toggles
      enableResults: [false],
      enableMetrics: [false],
      // form arrays
      results: this.fb.array([]),
      metrics: this.fb.array([]),
    });
  }
  getDropDowns() {
    forkJoin({
      countries: this.service.getCountries(),
      services: this.service.getServicesDropDown(),
    }).subscribe({
      next: (res) => {
        this.services = res.services.result;
        this.countries = res.countries.result;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getCitiesByCountry(countryId: string) {
    this.service.getCitiesByCountry(countryId).subscribe({
      next: (res) => {
        this.cities = res.result;
        if (this.cities) {
          this.form.get('city_id')?.enable();
        } else {
          this.form.get('city_id')?.disable();
        }
      },
      error: (err) => {
        console.error(err);
      },
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

  buildFormData(): FormData {
    const formData = new FormData();
    const value = this.form.getRawValue(); // includes disabled fields

    // 🔹 Basic fields
    formData.append('name', value.name);
    formData.append('brief', value.brief);
    formData.append('overview', value.overview);
    formData.append('start_date', this.formatDate(value.start_date));
    formData.append('end_date', this.formatDate(value.end_date));
    formData.append('country_id', value.country_id);
    formData.append('city_id', value.city_id);
    formData.append('status', value.status);

    // 🔹 Services (array of ids)
    value.service_ids.forEach((id: number, index: number) => {
      formData.append(`service_ids[${index}]`, id.toString());
    });

    // 🔹 Single images
    if (value.image_before) {
      formData.append('image_before', value.image_before);
    }

    if (value.image_after) {
      formData.append('image_after', value.image_after);
    }

    // 🔹 Gallery (array of images)
    if (value.gallery?.length) {
      value.gallery.forEach((file: File | any, index: number) => {
        // support old images (edit mode)
        if (file instanceof File) {
          formData.append(`gallery[${index}]`, file);
        } else if (file?.id) {
          formData.append(`gallery_ids[${index}]`, file.id);
        }
      });
    }

    // 🔹 Results
    if (value.enableResults && value.results?.length) {
      value.results.forEach((res: any, index: number) => {
        formData.append(`results[${index}][section_title]`, res.section_title);
        formData.append(`results[${index}][section_body]`, res.section_body);
      });
    }

    // 🔹 Metrics
    if (value.enableMetrics && value.metrics?.length) {
      value.metrics.forEach((met: any, index: number) => {
        formData.append(`metrics[${index}][metric_title]`, met.metric_title);
        formData.append(`metrics[${index}][metric_number]`, met.metric_number);
        formData.append(`metrics[${index}][metric_case]`, met.metric_case);
      });
    }

    return formData;
  }
  formatDate(date: Date | string | null): string {
    if (!date) return '';

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
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
  onSave() {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.service.create(this.buildFormData()).subscribe({
      next: (res) => {
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onLanguageChange(event: any) {
    console.log(event);
  }
  onFileSelected(event: File | File[]) {
    console.log(event);
  }
  submitForm() {
    console.log(this.form.value);
  }
}
