import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { CheckboxModule } from 'primeng/checkbox';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { DropDownOption } from '../../../../core/models/global.interface';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { ProjectsService } from '../../services/projects.service';
import { forkJoin } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProjectById } from '../../models/projects.interface';

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
    CheckboxModule,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
  @ViewChild(FormActionsComponent)formActionsComponent!:FormActionsComponent
  private readonly dialogService = inject(DialogService)
  private readonly service = inject(ProjectsService);
  private readonly translateService = inject(TranslateService)
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router)
  private cachedResults: any[] = [];
  private cachedMetrics: any[] = [];
  services: DropDownOption[] = [];
  countries: DropDownOption[] = [];
  metricCases: DropDownOption[] = [
    { name: 'general.up', id: 'up' },
    { name: 'general.down', id: 'down' },
    { name: 'general.stable', id: 'stable' },
  ];
  cities:DropDownOption[] = [];
  ref:DynamicDialogRef | undefined
  
  form!: FormGroup;
  projectId:string = '';
  isEditMode:boolean = false;
  projectData:ProjectById = {} as ProjectById

  ngOnInit() {

    this.getDropDowns()
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
      isCurrentlyActive: [false],
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
  getProjectById(id:string,culture:string){
    this.service.getById(id,culture).subscribe({
      next:(res)=>{
        if (!res.result) return;
        this.projectData = res.result;
        this.patchValues(this.projectData)
      },
      error:(err)=>{
        console.error('Failed to load project',err)
      }
    })
  }
  patchValues(data:ProjectById){
    if (!data) return;

    this.projectData = data;
    this.isEditMode = true;
    this.projectId = data.id;

    // helper to parse API date strings into Date objects for datepickers
    const parseDate = (d?: string | null): Date | null => {
      if (!d) return null;
      const iso = new Date(d);
      if (!isNaN(iso.getTime())) return iso;
      const parts = String(d).split(/[\/\-\.]/);
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return null;
    };

    // Basic scalar values
    this.form.patchValue({
      id:data.id,
      name: data.name || '',
      brief: data.brief || '',
      overview: data.overview || '',
      start_date: parseDate(data.startDate),
      end_date: parseDate(data.endDate),
      status: data.status ? 1 : 0,
      // toggles
      enableResults: !!(data.results && data.results.length),
      enableMetrics: !!(data.metrics && data.metrics.length),
      isCurrentlyActive: !data.endDate,
    });

    // Services (ids)
    const serviceIds = (data.services || []).map((s: any) => s.id);
    this.form.get('service_ids')?.setValue(serviceIds);

    // Images & gallery (keep existing objects so backend can accept ids)
    this.form.get('image_before')?.setValue(data.imageBefore || null);
    this.form.get('image_after')?.setValue(data.imageAfter || null);
    this.form.get('gallery')?.setValue(data.gallery || []);

    // Countries & cities: load cities then set city id
    if (data.country && data.country.id) {
      this.form.get('country_id')?.setValue(data.country.id);
      this.service.getCitiesByCountry(data.country.id).subscribe({
        next: (res) => {
          this.cities = res.result;
          if (this.cities && this.cities.length) {
            this.form.get('city_id')?.enable();
            this.form.get('city_id')?.setValue(data.city?.id || null);
          } else {
            this.form.get('city_id')?.disable();
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.form.get('country_id')?.setValue('');
      this.form.get('city_id')?.disable();
    }

    // Results: clear and populate
    this.results.clear();
    if (data.results && data.results.length) {
      data.results.forEach((r) => {
        this.results.push(
          this.createResult({
            section_title: r.sectionTitle || '',
            section_body: r.sectionBody || '',
          }),
        );
      });
    }

    // Metrics: clear and populate
    this.metrics.clear();
    if (data.metrics && data.metrics.length) {
      data.metrics.forEach((m) => {
        this.metrics.push(
          this.createMetric({
            metric_title: m.metricTitle || '',
            metric_number: m.metricNumber ?? '',
            metric_case: m.metricCase || '',
          }),
        );
      });
    }

    // cache current arrays in case toggles are used
    this.cachedResults = this.results.value || [];
    this.cachedMetrics = this.metrics.value || [];
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
  toggleCurrentlyActive() {
    const isActive = this.form.get('isCurrentlyActive')?.value;
    const endDateControl = this.form.get('end_date');

    console.log(this.form.value);
    if (!endDateControl) return;

    if (isActive) {
      // 🔴 Disable & clear end_date
      endDateControl.disable({ emitEvent: false });
      endDateControl.setValue(null);
    } else {
      // 🟢 Enable & re-validate end_date
      endDateControl.enable({ emitEvent: false });
      endDateControl.setValidators(Validators.required);
      endDateControl.updateValueAndValidity();
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
    this.submitForm(true,localStorage.getItem('app_lang')!);
  }
  submitForm(isNavigateOut:boolean = false,culture?:string){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.service.create(this.buildFormData(),culture).subscribe({
      next: (res) => {
        this.projectId = res.result.id;
        this.isEditMode = true;
        if(isNavigateOut) {
          this.router.navigate(['/projects']);
        }else{
          this.getProjectById(this.projectId,culture!)
        }
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  showConfirmDialog(lang:string) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
        header: 'Select a Product',
        width: '40vw',
        modal:true,
        data:{
            title:'projects.form.language_dialog.header',
            subtitle: 'projects.form.language_dialog.desc',
            confirmText: 'projects.form.btns.save',
            cancelText: 'general.cancel',
            confirmSeverity: 'success',
            cancelSeverity: 'cancel',
            showCancel: true,
            showExtraButton: false,
            data: { lang }
        }
    });
    this.ref.onClose.subscribe((product: {action:string,data:{lang:string}}) => {
            if (product) {
              if(product.action === 'confirm'){
                this.submitForm(false,product.data.lang);
              }
            }
        });
  }
  onLanguageChange(event: {newLang: string; oldLang: string;}) {
    if(this.form.invalid){
      setTimeout(() => {
        this.formActionsComponent.displayLanguage = event.oldLang
        this.form.markAllAsTouched()
      }, 0);
    }else{
      this.showConfirmDialog(event.oldLang);
    }
  }
  onFileSelected(event: File | File[]) {
    console.log(event);
  }
}
