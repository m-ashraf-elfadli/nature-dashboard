import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { EmptyStateActionComponent } from '../../../shared/components/empty-state-action/empty-state-action.component';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';
import {
  MiniTableColumn,
  MiniTableComponent,
} from '../../../shared/components/mini-table/mini-table.component';
import { StageFormComponent } from '../stage-form/stage-form.component';
import { ValueFormComponent } from '../value-form/value-form.component';
import { ResultsFormComponent } from '../results-form/results-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppDialogService } from '../../../shared/services/dialog.service';
import { ServicesService } from '../../../services/services.service';
import { environment } from '../../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '../../../core/validators/custom-validators.';

export interface ServiceItemFormValue {
  title: string;
  description: string;
  image?: File | null;
  imagePreview?: string | null;
  tools?: string[];
  [key: string]: any;
}

type LanguageStatusType = 'not-started' | 'ongoing' | 'completed';

const STATUS_MAP = {
  'not-started': 0,
  ongoing: 1,
  completed: 2,
} as const;

const DIALOG_CONFIGS = {
  stage: {
    headerKey: 'services.stage_form.create_title',
    component: StageFormComponent,
  },
  value: {
    headerKey: 'services.value_form.create_title',
    component: ValueFormComponent,
  },
  result: {
    headerKey: 'services.result_form.create_title',
    component: ResultsFormComponent,
  },
} as const;

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputSwitchModule,
    PageHeaderComponent,
    FormActionsComponent,
    EmptyStateActionComponent,
    SettingsComponent,
    MiniTableComponent,
    TranslateModule,
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss',
  providers: [AppDialogService],
})
export class ServiceFormComponent implements OnInit, AfterViewInit {
  pageTitle = '';
  serviceForm!: FormGroup;
  serviceId!: string;
  isEditMode = false;
  currentLanguage = 'en';
  previousLanguage = 'en';
  showLanguageSwitchToast = false;
  private languageNames: { [key: string]: string } = {
    en: 'English',
    ar: 'Arabic',
  };

  languageStatuses = new Map<
    string,
    { code: string; status: LanguageStatusType }
  >([
    ['en', { code: 'en', status: 'not-started' }],
    ['ar', { code: 'ar', status: 'not-started' }],
  ]);

  StageFormComponent = StageFormComponent;
  ValueFormComponent = ValueFormComponent;
  ResultsFormComponent = ResultsFormComponent;

  cols: MiniTableColumn[] = [
    { field: 'title', header: 'Title' },
    { field: 'description', header: 'Description' },
    { field: 'actions', header: 'Actions', type: 'edit-action' },
    { field: 'actions', header: '', type: 'delete-action' },
  ];

  @ViewChild(FormActionsComponent) formActionsComponent!: FormActionsComponent;
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  constructor(
    private fb: FormBuilder,
    private dialogService: AppDialogService,
    private servicesService: ServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.previousLanguage = this.currentLanguage;
    this.setPageTitle();

    // Set current language from localStorage
    const storedLang = localStorage.getItem('app_lang');
    if (storedLang) {
      this.currentLanguage = storedLang;
    }

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.serviceId = id;
        this.setPageTitle();
        this.loadService(id, this.currentLanguage);
      } else {
        this.updateLanguageStatus(this.currentLanguage, 'ongoing');
      }
    });

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(() => {
      this.setPageTitle();
    });
  }

  ngAfterViewInit() {
    // Update settings component after view is initialized
    this.updateSettingsComponent();
  }

  private setPageTitle(): void {
    this.pageTitle = this.isEditMode
      ? this.translate.instant('services.form.update_title')
      : this.translate.instant('services.form.title');
  }

  buildForm(): void {
    this.serviceForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      tagline: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      status: [1],
      steps: this.fb.array([], this.atLeastOneStepValidator()),
      values: this.fb.array([]),
      impacts: this.fb.array([]),
      benefitEnabled: [true],
      benefitTitle: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      benefitTagline: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      benefitBody: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      benefitInsights: this.fb.array([this.createInsightGroup()]),
    });

    this.serviceForm
      .get('benefitEnabled')
      ?.valueChanges.subscribe((enabled: boolean) => {
        this.toggleBenefitsFields(enabled);
      });

    // Track changes in form arrays to mark form as dirty
    this.subscribeToFormArrayChanges();
  }

  private atLeastOneStepValidator(): (
    control: AbstractControl,
  ) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      return formArray && formArray.length > 0 ? null : { required: true };
    };
  }

  private subscribeToFormArrayChanges(): void {
    // Subscribe to value changes in all form arrays
    [
      this.stagesArray,
      this.serviceValuesArray,
      this.serviceResultsArray,
      this.benefitInsightsArray,
    ].forEach((array) => {
      array.valueChanges.subscribe(() => {
        this.serviceForm.markAsDirty();
      });
    });
  }

  private createInsightGroup(data?: any): FormGroup {
    return this.fb.group({
      id: [data?.id],
      metricTitle: [
        data?.metricTitle || '',
        [Validators.minLength(3), Validators.maxLength(50)],
      ],
      metricNumber: [
        data?.metricNumber || '',
        [CustomValidators.numericOnly(), CustomValidators.minValue(0)],
      ],
    });
  }

  private updateLanguageStatus(lang: string, status: LanguageStatusType): void {
    this.languageStatuses.set(lang, { code: lang, status });
    this.updateSettingsComponent();
  }

  private updateSettingsComponent(): void {
    if (!this.settingsComponent) return;

    const getStatus = (lang: string) =>
      STATUS_MAP[this.languageStatuses.get(lang)?.status || 'not-started'];

    this.settingsComponent.englishStatus = getStatus('en');
    this.settingsComponent.arabicStatus = getStatus('ar');

    // Trigger change detection to ensure the view updates
    this.cdr.detectChanges();
  }

  loadService(id: string, lang: string): void {
    this.servicesService.getServiceById(id, lang).subscribe({
      next: (res: any) => {
        const service = res.result;

        if (service.localeComplete) {
          Object.entries(service.localeComplete).forEach(
            ([langKey, isComplete]) => {
              const status = isComplete ? 'completed' : 'ongoing';
              this.languageStatuses.set(langKey, {
                code: langKey,
                status: status as LanguageStatusType,
              });
            },
          );
          this.updateSettingsComponent();
        }

        // After patching, update the current language status based on localeComplete
        const currentLocaleStatus = service.localeComplete?.[lang];
        if (currentLocaleStatus === false) {
          this.updateLanguageStatus(lang, 'ongoing');
        } else if (currentLocaleStatus === true) {
          this.updateLanguageStatus(lang, 'completed');
        } else {
          // If localeComplete doesn't have this language, mark as ongoing
          this.updateLanguageStatus(lang, 'ongoing');
        }

        this.serviceForm.patchValue({
          name: service.name || '',
          tagline: service.tagline || '',
          status: service.status ? 1 : 0,
          benefitTitle: service.benefitTitle || '',
          benefitTagline: service.benefitTagline || '',
          benefitBody: service.benefitBody || '',
          benefitEnabled: service.benefitEnabled ?? true,
        });

        // Trigger benefit fields validation after patching values
        this.toggleBenefitsFields(service.benefitEnabled ?? true);

        this.populateArray(this.stagesArray, service.steps, (step: any) => ({
          ...step,
          imagePreview: step.image ? this.getImageUrl(step.image) : null,
        }));

        this.populateArray(
          this.serviceValuesArray,
          service.values,
          (val: any) => ({
            ...val,
            tools: val.tools || [],
          }),
        );

        this.populateArray(
          this.serviceResultsArray,
          service.impacts,
          (impact: any) => ({
            ...impact,
            imagePreview: impact.image ? this.getImageUrl(impact.image) : null,
          }),
        );

        this.populateInsights(service.benefitInsights);
        this.serviceForm.markAsPristine();
      },
      error: () => {
        this.clearFormForNewLanguage();
        this.updateLanguageStatus(lang, 'ongoing');
      },
    });
  }

  private populateArray(
    formArray: FormArray,
    data: any[],
    transform?: (item: any) => any,
  ): void {
    formArray.clear();
    data?.forEach((item) => {
      const processedItem = transform ? transform(item) : item;
      formArray.push(this.createItemGroup(processedItem));
    });
  }

  private populateInsights(insights: any[]): void {
    this.benefitInsightsArray.clear();
    if (insights?.length) {
      insights.forEach((insight) =>
        this.benefitInsightsArray.push(this.createInsightGroup(insight)),
      );
    } else {
      this.benefitInsightsArray.push(this.createInsightGroup());
    }
  }

  getImageUrl(path: string): string {
    return `${environment.mediaUrl}/${path}`;
  }

  private toggleBenefitsFields(enabled: boolean): void {
    const fields = ['benefitTitle', 'benefitTagline', 'benefitBody'];
    fields.forEach((field) => {
      const control = this.serviceForm.get(field);
      if (enabled) {
        control?.setValidators([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]);
        control?.enable();
      } else {
        control?.clearValidators();
        control?.disable();
      }
      control?.updateValueAndValidity();
    });

    this.benefitInsightsArray.controls.forEach((group) => {
      enabled ? group.enable() : group.disable();
    });
  }

  // Form Arrays
  get stagesArray(): FormArray {
    return this.serviceForm.get('steps') as FormArray;
  }

  get serviceValuesArray(): FormArray {
    return this.serviceForm.get('values') as FormArray;
  }

  get serviceResultsArray(): FormArray {
    return this.serviceForm.get('impacts') as FormArray;
  }

  get benefitInsightsArray(): FormArray {
    return this.serviceForm.get('benefitInsights') as FormArray;
  }

  get benefitEnabledControl(): FormControl {
    return this.serviceForm.get('benefitEnabled') as FormControl;
  }

  get stages(): ServiceItemFormValue[] {
    return this.stagesArray.value;
  }

  get serviceValues(): ServiceItemFormValue[] {
    return this.serviceValuesArray.value;
  }

  get serviceResults(): ServiceItemFormValue[] {
    return this.serviceResultsArray.value;
  }

  get isFormValid(): boolean {
    return this.serviceForm.valid;
  }

  get stepsError(): string {
    if (this.stagesArray.hasError('required') && this.stagesArray.touched) {
      return this.translate.instant('services.form.stages.error_required');
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);

    // For benefit fields, only show invalid if benefits are enabled
    const benefitFields = ['benefitTitle', 'benefitTagline', 'benefitBody'];
    if (benefitFields.includes(fieldName)) {
      const benefitEnabled = this.benefitEnabledControl?.value;
      if (!benefitEnabled) {
        return false;
      }
    }

    return !!(field?.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.hasError('required')) {
      return this.translate.instant(
        `services.form.validation.${fieldName}_required`,
      );
    }
    if (field.hasError('minlength')) {
      return this.translate.instant(
        `services.form.validation.${fieldName}_min`,
      );
    }
    if (field.hasError('maxlength')) {
      return this.translate.instant(
        `services.form.validation.${fieldName}_max`,
      );
    }
    return '';
  }

  getInsightFieldError(index: number, fieldName: string): string {
    const control = this.benefitInsightsArray.at(index).get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.hasError('minlength')) {
      return this.translate.instant(
        `services.form.benefits.insights.${fieldName}_min`,
      );
    }
    if (control.hasError('maxlength')) {
      return this.translate.instant(
        `services.form.benefits.insights.${fieldName}_max`,
      );
    }
    if (control.hasError('numericOnly')) {
      return this.translate.instant(
        'services.form.benefits.insights.number_invalid',
      );
    }
    if (control.hasError('minValue')) {
      return this.translate.instant(
        'services.form.benefits.insights.number_min',
      );
    }
    return '';
  }

  isInsightFieldInvalid(index: number, fieldName: string): boolean {
    const control = this.benefitInsightsArray.at(index).get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  private createItemGroup(item: ServiceItemFormValue): FormGroup {
    const config: any = {
      title: [item.title, Validators.required],
      description: [item.description, Validators.required],
    };

    const optionalFields = ['image', 'imagePreview', 'tools'];
    optionalFields.forEach((field) => {
      if (item.hasOwnProperty(field)) {
        config[field] = field === 'tools' ? [item.tools || []] : [item[field]];
      }
    });

    Object.keys(item).forEach((key) => {
      if (![...optionalFields, 'title', 'description'].includes(key)) {
        config[key] = [item[key]];
      }
    });

    return this.fb.group(config);
  }

  private areRequiredFieldsFilled(): boolean {
    return !!(
      this.serviceForm.get('name')?.valid &&
      this.serviceForm.get('tagline')?.valid
    );
  }

  private validateAndMarkFields(): boolean {
    if (!this.isEditMode && !this.areRequiredFieldsFilled()) {
      this.serviceForm.get('name')?.markAsTouched();
      this.serviceForm.get('tagline')?.markAsTouched();
      return false;
    }
    return true;
  }

  openStagePopup(): void {
    this.openItemPopup('stage');
  }

  openServiceValuePopup(): void {
    this.openItemPopup('value');
  }

  openServiceResultPopup(): void {
    this.openItemPopup('result');
  }

  addBenefitsInsight(): void {
    if (this.benefitInsightsArray.length < 3) {
      this.benefitInsightsArray.push(this.createInsightGroup());
    }
  }

  private openItemPopup(type: keyof typeof DIALOG_CONFIGS): void {
    const config = DIALOG_CONFIGS[type];
    const targetArray =
      type === 'stage'
        ? this.stagesArray
        : type === 'value'
          ? this.serviceValuesArray
          : this.serviceResultsArray;

    const ref = this.dialogService.open(config.component, {
      header: this.translate.instant(config.headerKey),
      width: '600px',
    });

    ref.onClose.subscribe((data: ServiceItemFormValue | null) => {
      if (!data) return;

      const processedData = { ...data };
      if (data.image) {
        processedData.imagePreview = URL.createObjectURL(data.image);
      }
      targetArray.push(this.createItemGroup(processedData));
    });
  }

  // Delete handlers
  onDeleteStage(index: number): void {
    this.removeFromArray(this.stagesArray, index);
  }

  onDeleteServiceValue(index: number): void {
    this.removeFromArray(this.serviceValuesArray, index);
  }

  onDeleteServiceResult(index: number): void {
    this.removeFromArray(this.serviceResultsArray, index);
  }

  onDeleteBenefitsInsight(index: number): void {
    this.removeFromArray(this.benefitInsightsArray, index);
  }

  // Edit handlers
  onEditStage(result: any): void {
    this.updateArrayItem(this.stagesArray, result);
  }

  onEditServiceValue(result: any): void {
    this.updateArrayItem(this.serviceValuesArray, result);
  }

  onEditServiceResult(result: any): void {
    this.updateArrayItem(this.serviceResultsArray, result);
  }

  private updateArrayItem(array: FormArray, result: any): void {
    if (!result) return;

    const { index, rowData } = result;
    if (index !== undefined && array.at(index)) {
      array.at(index).patchValue(rowData || result);
    }
  }

  // Reorder handlers
  onReorder(data: any): void {
    this.reorderArray(this.stagesArray, data);
  }

  onReorderServiceValues(data: any): void {
    this.reorderArray(this.serviceValuesArray, data);
  }

  onReorderServiceResults(data: any): void {
    this.reorderArray(this.serviceResultsArray, data);
  }

  private reorderArray(formArray: FormArray, data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!items.length) return;

    formArray.clear();
    items.forEach((item: any) => formArray.push(this.createItemGroup(item)));
  }

  private removeFromArray(array: FormArray, index: number): void {
    const item = array.at(index)?.value;
    if (item?.imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(item.imagePreview);
    }
    array.removeAt(index);
  }

  onDiscard(): void {
    this.router.navigate(['/services/']);
  }

  submitForm(lang: string, navigateAway = false): void {
    if (!this.serviceForm.valid) {
      this.serviceForm.markAllAsTouched();
      this.stagesArray.markAsTouched();
      return;
    }

    const formData = new FormData();
    this.appendFormData(formData, this.serviceForm.value);

    const request$ = this.serviceId
      ? this.servicesService.updateService(this.serviceId, formData, lang)
      : this.servicesService.createService(formData, lang);

    request$.subscribe({
      next: (response: any) => {
        if (!this.serviceId && response?.result?.id) {
          this.serviceId = response.result.id;
          this.isEditMode = true;
          this.setPageTitle();
        }

        this.updateLanguageStatus(lang, 'completed');
        this.serviceForm.markAsPristine();

        if (navigateAway) {
          this.router.navigate(['/services/']);
        }
      },
      error: (err) => console.error('Error saving service:', err),
    });
  }

  private appendFormData(formData: FormData, data: any, parentKey = ''): void {
    if (data == null) return;

    if (data instanceof File) {
      formData.append(parentKey, data);
      return;
    }

    if (typeof data === 'string' && parentKey.toLowerCase().includes('image')) {
      return;
    }

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        this.appendFormData(formData, item, `${parentKey}[${index}]`);
      });
      return;
    }

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'imagePreview') return;
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;
        this.appendFormData(formData, value, fullKey);
      });
      return;
    }

    formData.append(parentKey, data);
  }

  onLanguageChange(event: { newLang: string; oldLang: string }): void {
    if (this.isEditMode) {
      if (this.serviceForm.dirty) {
        this.showLanguageChangeConfirmation(event);
      } else {
        this.switchLanguage(event.newLang);
      }
      return;
    }

    if (!this.serviceForm.valid) {
      this.serviceForm.markAllAsTouched();
      this.stagesArray.markAsTouched();
      this.resetLanguage(event.oldLang);
      return;
    }

    this.showLanguageChangeConfirmation(event);
  }

  private showLanguageChangeConfirmation(event: {
    newLang: string;
    oldLang: string;
  }): void {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      header: this.translate.instant('projects.form.language_dialog.header'),
      width: '500px',
      data: {
        title: this.translate.instant('projects.form.language_dialog.header'),
        subtitle: this.translate.instant('projects.form.language_dialog.desc'),
        confirmText: this.translate.instant('common.save'),
        cancelText: this.translate.instant('common.discard'),
        confirmSeverity: 'success',
        cancelSeverity: 'cancel',
        showCancel: true,
      },
    });

    ref.onClose.subscribe((result: any) => {
      if (!result) {
        this.resetLanguage(event.oldLang);
        return;
      }

      if (result.action === 'cancel') {
        this.switchLanguage(event.newLang);
      } else if (result.action === 'confirm') {
        this.saveAndSwitchLanguage(event.oldLang, event.newLang);
      }
    });
  }

  private saveAndSwitchLanguage(currentLang: string, newLang: string): void {
    if (!this.serviceForm.valid) {
      this.serviceForm.markAllAsTouched();
      this.stagesArray.markAsTouched();
      this.resetLanguage(currentLang);
      return;
    }

    const formData = new FormData();
    this.appendFormData(formData, this.serviceForm.value);

    const request$ = this.serviceId
      ? this.servicesService.updateService(
          this.serviceId,
          formData,
          currentLang,
        )
      : this.servicesService.createService(formData, currentLang);

    request$.subscribe({
      next: (response: any) => {
        if (!this.serviceId && response?.result?.id) {
          this.serviceId = response.result.id;
          this.isEditMode = true;
          this.setPageTitle();
        }

        this.updateLanguageStatus(currentLang, 'completed');
        this.switchLanguage(newLang);
      },
      error: () => this.resetLanguage(currentLang),
    });
  }

  private switchLanguage(lang: string): void {
    // Store the current language as previous before switching
    this.previousLanguage = this.currentLanguage;
    this.currentLanguage = lang;
    this.showLanguageSwitchToast = true;

    this.commitLanguage(lang);

    // Mark as ongoing when switching to it (unless already completed)
    const currentStatus = this.languageStatuses.get(lang)?.status;
    if (currentStatus !== 'completed') {
      this.updateLanguageStatus(lang, 'ongoing');
    }

    if (this.isEditMode && this.serviceId) {
      this.loadService(this.serviceId, lang);
    } else {
      this.clearFormForNewLanguage();
    }
  }

  hideLanguageSwitchToast(): void {
    this.showLanguageSwitchToast = false;
  }

  private clearFormForNewLanguage(): void {
    this.serviceForm.patchValue({
      name: '',
      tagline: '',
      benefitTitle: '',
      benefitTagline: '',
      benefitBody: '',
    });

    [
      this.stagesArray,
      this.serviceValuesArray,
      this.serviceResultsArray,
    ].forEach((arr) => arr.clear());

    this.benefitInsightsArray.clear();
    this.benefitInsightsArray.push(this.createInsightGroup());

    this.serviceForm.markAsPristine();
  }

  private resetLanguage(lang: string): void {
    this.formActionsComponent?.revertLanguage();
    this.currentLanguage = lang;
  }

  private commitLanguage(lang: string): void {
    this.formActionsComponent?.confirmLanguage(lang);
  }

  onSave(): void {
    this.submitForm(this.currentLanguage, true);
  }

  getLanguageName(langCode: string): string {
    return this.languageNames[langCode] || langCode.toUpperCase();
  }
}
