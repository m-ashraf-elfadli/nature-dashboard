import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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

export interface ServiceItemFormValue {
  title: string;
  description: string;
  image?: File | null;
  imagePreview?: string | null;
  tools?: string[];
  [key: string]: any;
}

export interface LanguageStatus {
  code: string;
  status: 'not-started' | 'ongoing' | 'completed';
}

export interface ServiceResponse {
  status: string;
  message: string;
  result: {
    id: string;
    name: string;
    tagline: string;
    steps: any[];
    benefitTitle: string | null;
    benefitTagline: string | null;
    benefitBody: string | null;
    benefitInsights: any[];
    benefitEnabled: boolean;
    values: any[];
    impacts: any[];
    status: boolean;
    localeComplete: {
      [key: string]: boolean;
    };
    createdAt: string;
    updatedAt: string;
  };
}

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputSwitchModule,
    PageHeaderComponent,
    FormActionsComponent,
    EmptyStateActionComponent,
    SettingsComponent,
    MiniTableComponent,
    FormsModule,
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss',
  providers: [AppDialogService],
})
export class ServiceFormComponent implements OnInit {
  pageTitle = 'Add New Service';
  serviceForm!: FormGroup;
  serviceId!: string;
  isEditMode = false;
  currentLanguage = 'en';

  // Language status tracking
  languageStatuses: Map<string, LanguageStatus> = new Map([
    ['en', { code: 'en', status: 'not-started' }],
    ['ar', { code: 'ar', status: 'not-started' }],
  ]);

  // Track if form was loaded from API (pristine state from server)
  private loadedFromApi = false;

  StageFormComponent = StageFormComponent;
  ValueFormComponent = ValueFormComponent;
  ResultsFormComponent = ResultsFormComponent;

  @ViewChild(FormActionsComponent)
  formActionsComponent!: FormActionsComponent;

  @ViewChild(SettingsComponent)
  settingsComponent!: SettingsComponent;

  constructor(
    private fb: FormBuilder,
    private dialogService: AppDialogService,
    private servicesService: ServicesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.serviceId = id;
        this.pageTitle = 'Edit Service';
        this.loadService(id, this.currentLanguage);
      } else {
        // Create mode - mark current language as ongoing
        this.updateLanguageStatus(this.currentLanguage, 'ongoing');
      }
    });

    // Track form changes to update status
    this.serviceForm.valueChanges.subscribe(() => {
      // Only mark as ongoing if form is dirty AND was loaded from API
      if (this.serviceForm.dirty && this.loadedFromApi) {
        const currentStatus = this.languageStatuses.get(
          this.currentLanguage,
        )?.status;
        // Only change to ongoing if it was completed before
        if (currentStatus === 'completed') {
          this.updateLanguageStatus(this.currentLanguage, 'ongoing');
        }
      }
    });
  }

  buildForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      tagline: ['', Validators.required],
      status: [1],

      // arrays
      steps: this.fb.array([]),
      values: this.fb.array([]),
      impacts: this.fb.array([]),

      // Benefits section
      benefitEnabled: [true],
      benefitTitle: [''],
      benefitTagline: [''],
      benefitBody: [''],

      benefitInsights: this.fb.array([
        this.fb.group({
          metricTitle: [''],
          metricNumber: [''],
        }),
      ]),
    });

    // enable / disable benefits fields
    this.serviceForm
      .get('benefitEnabled')
      ?.valueChanges.subscribe((enabled: boolean) => {
        this.toggleBenefitsFields(enabled);
      });
  }

  /**
   * Update language statuses from API response
   */
  private updateLanguageStatusesFromApi(localeComplete: {
    [key: string]: boolean;
  }): void {
    Object.keys(localeComplete).forEach((lang) => {
      const isComplete = localeComplete[lang];
      const status = isComplete ? 'completed' : 'not-started';
      this.languageStatuses.set(lang, { code: lang, status });
    });

    // Mark current language as ongoing since we're viewing/editing it
    // this.updateLanguageStatus(this.currentLanguage, 'ongoing');

    this.updateSettingsComponent();
  }

  /**
   * Update language status
   */
  private updateLanguageStatus(
    lang: string,
    status: 'not-started' | 'ongoing' | 'completed',
  ): void {
    this.languageStatuses.set(lang, { code: lang, status });
    this.updateSettingsComponent();
  }

  /**
   * Update settings component with current statuses
   */
  private updateSettingsComponent(): void {
    if (this.settingsComponent) {
      const enStatus = this.languageStatuses.get('en')?.status || 'not-started';
      const arStatus = this.languageStatuses.get('ar')?.status || 'not-started';

      // Map to numeric values for settings component
      const statusMap = {
        'not-started': 0,
        ongoing: 1,
        completed: 2,
      };

      this.settingsComponent.englishStatus = statusMap[enStatus];
      this.settingsComponent.arabicStatus = statusMap[arStatus];
    }
  }

  loadService(id: string, lang: string) {
    this.servicesService.getServiceById(id, lang).subscribe({
      next: (res: ServiceResponse) => {
        const service = res.result;

        // Update language statuses from API
        if (service.localeComplete) {
          this.updateLanguageStatusesFromApi(service.localeComplete);
        }

        // Set flag that data was loaded from API
        this.loadedFromApi = true;

        // Populate the form
        this.serviceForm.patchValue({
          name: service.name || '',
          tagline: service.tagline || '',
          status: service.status ? 1 : 0,
          benefitTitle: service.benefitTitle || '',
          benefitTagline: service.benefitTagline || '',
          benefitBody: service.benefitBody || '',
          benefitEnabled: service.benefitEnabled ?? true,
        });

        // Clear and populate arrays
        this.stagesArray.clear();
        service.steps?.forEach((step: any) => {
          this.stagesArray.push(
            this.createItemGroup({
              ...step,
              imagePreview: step.image ? this.getImageUrl(step.image) : null,
            }),
          );
        });

        this.serviceValuesArray.clear();
        service.values?.forEach((val: any) => {
          this.serviceValuesArray.push(
            this.createItemGroup({ ...val, tools: val.tools || [] }),
          );
        });

        this.serviceResultsArray.clear();
        service.impacts?.forEach((impact: any) => {
          this.serviceResultsArray.push(
            this.createItemGroup({
              ...impact,
              imagePreview: impact.image
                ? this.getImageUrl(impact.image)
                : null,
            }),
          );
        });

        this.benefitInsightsArray.clear();
        if (service.benefitInsights && service.benefitInsights.length > 0) {
          service.benefitInsights.forEach((insight: any) => {
            this.benefitInsightsArray.push(
              this.fb.group({
                id: [insight.id],
                metricTitle: [insight.metricTitle || ''],
                metricNumber: [insight.metricNumber || ''],
              }),
            );
          });
        }

        // If no insights, add default one
        if (this.benefitInsightsArray.length === 0) {
          this.benefitInsightsArray.push(
            this.fb.group({
              metricTitle: [''],
              metricNumber: [''],
            }),
          );
        }

        // Mark form as pristine after loading
        this.serviceForm.markAsPristine();
        this.serviceForm.markAsUntouched();
      },
      error: (err) => {
        console.log(
          `No data found for language ${lang}, starting fresh for this language`,
        );
        this.loadedFromApi = false;
        this.clearFormForNewLanguage();
        this.updateLanguageStatus(lang, 'not-started');
      },
    });
  }

  getImageUrl(path: string): string {
    return `${environment.mediaUrl}/${path}`;
  }

  private toggleBenefitsFields(enabled: boolean): void {
    const benefitsFields = ['benefitTitle', 'benefitTagline', 'benefitBody'];
    benefitsFields.forEach((field) => {
      const control = this.serviceForm.get(field);
      if (enabled) {
        control?.enable();
      } else {
        control?.disable();
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });

    this.benefitInsightsArray.controls.forEach((group) => {
      if (enabled) {
        group.enable();
      } else {
        group.disable();
      }
    });
  }

  /* ---------------- TABLE CONFIG ---------------- */

  cols: MiniTableColumn[] = [
    { field: 'title', header: 'Title' },
    { field: 'description', header: 'Description' },
    { field: 'actions', header: 'Actions', type: 'edit-action' },
    { field: 'actions', header: '', type: 'delete-action' },
  ];

  /* ---------------- FORM ARRAYS ---------------- */

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

  get benefitInsights(): ServiceItemFormValue[] {
    return this.benefitInsightsArray.value;
  }

  getInsightControl(index: number, field: string) {
    return this.benefitInsightsArray.at(index)?.get(field);
  }

  /* ---------------- FORM VALIDATION HELPERS ---------------- */

  get isFormValid(): boolean {
    return this.serviceForm.valid;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }

  /* ---------------- FACTORY ---------------- */

  private createItemGroup(item: ServiceItemFormValue): FormGroup {
    const groupConfig: any = {
      title: [item.title, Validators.required],
      description: [item.description, Validators.required],
    };

    if (item.hasOwnProperty('image')) {
      groupConfig.image = [item.image];
    }

    if (item.hasOwnProperty('imagePreview')) {
      groupConfig.imagePreview = [item.imagePreview];
    }

    if (item.hasOwnProperty('tools')) {
      groupConfig.tools = [item.tools || []];
    }

    Object.keys(item).forEach((key) => {
      if (
        !['title', 'description', 'image', 'imagePreview', 'tools'].includes(
          key,
        )
      ) {
        groupConfig[key] = [item[key]];
      }
    });

    return this.fb.group(groupConfig);
  }

  /* ---------------- DIALOG ---------------- */

  /**
   * Check if required fields are filled (for create mode)
   */
  private areRequiredFieldsFilled(): boolean {
    const name = this.serviceForm.get('name');
    const tagline = this.serviceForm.get('tagline');

    return !!(name?.valid && tagline?.valid);
  }

  openStagePopup(): void {
    this.openItemPopup(this.stagesArray, 'Create New Stage');
  }

  openServiceValuePopup(): void {
    if (!this.isEditMode && !this.areRequiredFieldsFilled()) {
      this.serviceForm.get('name')?.markAsTouched();
      this.serviceForm.get('tagline')?.markAsTouched();
      return;
    }

    this.openItemPopup(this.serviceValuesArray, 'Create New Value');
  }

  openServiceResultPopup(): void {
    if (!this.isEditMode && !this.areRequiredFieldsFilled()) {
      this.serviceForm.get('name')?.markAsTouched();
      this.serviceForm.get('tagline')?.markAsTouched();
      return;
    }

    this.openItemPopup(
      this.serviceResultsArray,
      'Create New Results & Impacts',
    );
  }

  addBenefitsInsight(): void {
    if (this.benefitInsightsArray.length < 3) {
      const insightGroup = this.fb.group({
        metricTitle: [''],
        metricNumber: [''],
      });
      this.benefitInsightsArray.push(insightGroup);
    }
  }

  private openItemPopup(targetArray: FormArray, header: string): void {
    let component;

    if (header.includes('Stage')) {
      component = StageFormComponent;
    } else if (header.includes('Value')) {
      component = ValueFormComponent;
    } else if (header.includes('Results')) {
      component = ResultsFormComponent;
    } else {
      component = StageFormComponent;
    }

    const ref = this.dialogService.open(component, {
      header,
      width: '600px',
    });

    ref.onClose.subscribe((data: ServiceItemFormValue | null) => {
      if (!data) return;

      const processedData: ServiceItemFormValue = { ...data };

      if (data.image) {
        processedData.imagePreview = URL.createObjectURL(data.image);
      }

      if (data.tools && Array.isArray(data.tools)) {
        processedData.tools = data.tools;
      }

      targetArray.push(this.createItemGroup(processedData));
    });
  }

  /* ---------------- TABLE ACTIONS ---------------- */

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

  onEditStage(result: any): void {
    if (!result) return;

    const updatedData = result.rowData || result;
    const index = result.index;

    if (index !== undefined && this.stagesArray.at(index)) {
      this.stagesArray.at(index).patchValue(updatedData);
    }
  }

  onEditServiceValue(result: any): void {
    const updatedData = result.rowData || result;
    const index = result.index;

    if (index !== undefined && this.serviceValuesArray.at(index)) {
      this.serviceValuesArray.at(index).patchValue(updatedData);
    }
  }

  onEditServiceResult(result: any): void {
    if (!result) return;

    const updatedData = result.rowData || result;
    const index = result.index;

    if (index !== undefined && this.serviceResultsArray.at(index)) {
      this.serviceResultsArray.at(index).patchValue(updatedData);
    }
  }

  onReorder(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.stagesArray.clear();
    items.forEach((item) => this.stagesArray.push(this.createItemGroup(item)));
  }

  onReorderServiceValues(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.serviceValuesArray.clear();
    items.forEach((item) =>
      this.serviceValuesArray.push(this.createItemGroup(item)),
    );
  }

  onReorderServiceResults(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.serviceResultsArray.clear();
    items.forEach((item) =>
      this.serviceResultsArray.push(this.createItemGroup(item)),
    );
  }

  onReorderbenefitInsights(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.benefitInsightsArray.clear();
    items.forEach((item) =>
      this.benefitInsightsArray.push(this.createItemGroup(item)),
    );
  }

  private removeFromArray(array: FormArray, index: number): void {
    const item = array.at(index)?.value;
    if (item?.imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(item.imagePreview);
    }
    array.removeAt(index);
  }

  /* ---------------- FORM ACTIONS ---------------- */

  onDiscard(): void {
    this.router.navigate(['/services/']);
  }

  /**
   * Submit form - handles both create and save operations
   * @param navigateAway - if true, navigates to services list after save
   */
  submitForm(lang: string, navigateAway: boolean = false): void {
    if (!this.serviceForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.serviceForm.controls).forEach((key) => {
        this.serviceForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = new FormData();
    this.appendFormData(formData, this.serviceForm.value);

    const request$ = this.serviceId
      ? this.servicesService.updateService(this.serviceId, formData, lang)
      : this.servicesService.createService(formData, lang);

    request$.subscribe({
      next: (response: any) => {
        // If this was create mode and we got an ID back, store it
        if (!this.serviceId && response?.result?.id) {
          this.serviceId = response.result.id;
          // Switch to edit mode now that we have an ID
          this.isEditMode = true;
          this.pageTitle = 'Edit Service';
        }

        // Mark language as completed
        this.updateLanguageStatus(lang, 'completed');

        // Mark form as pristine
        this.serviceForm.markAsPristine();
        this.serviceForm.markAsUntouched();

        // Update loaded from API flag
        this.loadedFromApi = true;

        console.log(`Service saved successfully for language: ${lang}`);

        // Navigate if requested
        if (navigateAway) {
          this.router.navigate(['/services/']);
        }
      },
      error: (err) => {
        console.error('Error saving service:', err);
      },
    });
  }

  appendFormData(formData: FormData, data: any, parentKey: string = '') {
    if (data === null || data === undefined) return;

    if (data instanceof File) {
      formData.append(parentKey, data);
      return;
    }

    if (typeof data === 'string' && parentKey.toLowerCase().includes('image')) {
      return;
    }

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const key = `${parentKey}[${index}]`;
        this.appendFormData(formData, item, key);
      });
      return;
    }

    if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        if (key === 'imagePreview') return;

        const fullKey = parentKey ? `${parentKey}[${key}]` : key;
        this.appendFormData(formData, data[key], fullKey);
      });
      return;
    }

    formData.append(parentKey, data);
  }

  /**
   * Handle language change with confirmation dialog
   */
  onLanguageChange(event: { newLang: string; oldLang: string }): void {
    // EDIT MODE: Check if there are unsaved changes
    if (this.isEditMode) {
      if (this.serviceForm.dirty) {
        this.showLanguageChangeConfirmation(event);
      } else {
        // No unsaved changes, direct switch
        this.switchLanguage(event.newLang);
      }
      return;
    }

    // CREATE MODE: Check validation
    if (!this.serviceForm.valid) {
      this.serviceForm.markAllAsTouched();
      this.resetLanguage(event.oldLang);
      return;
    }

    // Form is valid in create mode, show confirmation
    this.showLanguageChangeConfirmation(event);
  }

  /**
   * Show confirmation dialog for language change
   */
  private showLanguageChangeConfirmation(event: {
    newLang: string;
    oldLang: string;
  }): void {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Change Language',
      width: '500px',
      data: {
        title: 'Unsaved Changes?',
        subtitle:
          'You have unsaved changes in the current language. Do you want to save them before switching?',
        confirmText: 'Save Changes',
        cancelText: 'Discard Changes',
        confirmSeverity: 'success',
        cancelSeverity: 'secondary',
        showCancel: true,
      },
    });

    ref.onClose.subscribe((result: any) => {
      if (!result) {
        // Dialog closed without action - revert language
        this.resetLanguage(event.oldLang);
        return;
      }

      if (result.action === 'cancel') {
        // User chose to discard changes
        this.switchLanguage(event.newLang);
        return;
      }

      if (result.action === 'confirm') {
        // User chose to save changes
        this.saveAndSwitchLanguage(event.oldLang, event.newLang);
      }
    });
  }

  /**
   * Save current language data and switch to new language
   */
  private saveAndSwitchLanguage(currentLang: string, newLang: string): void {
    if (!this.serviceForm.valid) {
      this.serviceForm.markAllAsTouched();
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
        // If this was create mode and we got an ID back, store it
        if (!this.serviceId && response?.result?.id) {
          this.serviceId = response.result.id;
          this.isEditMode = true;
          this.pageTitle = 'Edit Service';
        }

        // Mark current language as completed
        this.updateLanguageStatus(currentLang, 'completed');

        // Now switch to the new language
        this.switchLanguage(newLang);
      },
      error: (err) => {
        console.error('Error saving service:', err);
        // Revert language selection on error
        this.resetLanguage(currentLang);
      },
    });
  }

  /**
   * Switch to a new language
   */
  private switchLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.commitLanguage(lang);

    // Mark new language as ongoing (if not already completed or not-started)
    const currentStatus = this.languageStatuses.get(lang)?.status;
    if (currentStatus === 'not-started') {
      this.updateLanguageStatus(lang, 'ongoing');
    }

    if (this.isEditMode && this.serviceId) {
      // Load data for the new language
      this.loadService(this.serviceId, lang);
    } else {
      // Clear form for new language in create mode
      this.clearFormForNewLanguage();
      this.loadedFromApi = false;
    }
  }

  /**
   * Clear form for new language while preserving service ID
   */
  private clearFormForNewLanguage(): void {
    this.serviceForm.patchValue({
      name: '',
      tagline: '',
      benefitTitle: '',
      benefitTagline: '',
      benefitBody: '',
    });

    this.stagesArray.clear();
    this.serviceValuesArray.clear();
    this.serviceResultsArray.clear();

    this.benefitInsightsArray.clear();
    this.benefitInsightsArray.push(
      this.fb.group({
        metricTitle: [''],
        metricNumber: [''],
      }),
    );

    this.serviceForm.markAsPristine();
    this.serviceForm.markAsUntouched();
  }

  private resetLanguage(lang: string): void {
    if (this.formActionsComponent) {
      this.formActionsComponent.revertLanguage();
    }
    this.currentLanguage = lang;
  }

  private commitLanguage(lang: string): void {
    if (this.formActionsComponent) {
      this.formActionsComponent.confirmLanguage(lang);
    }
  }

  /**
   * Handle save button click from form actions
   * This navigates away after saving
   */
  onSave(): void {
    this.submitForm(this.currentLanguage, true);
  }
}
