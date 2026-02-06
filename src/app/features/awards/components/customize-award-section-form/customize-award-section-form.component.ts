import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
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
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppDialogService } from '../../../../shared/services/dialog.service';
import { CustomizeService } from '../../../../services/customize.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AwardsSliderComponent } from '../../../../shared/components/awards-slider/awards-slider.component';
import { ApiService } from '../../../../core/services/api.service';

type LanguageStatusType = 'not-started' | 'ongoing' | 'completed';

const STATUS_MAP = {
  'not-started': 0,
  ongoing: 1,
  completed: 2,
} as const;

@Component({
  selector: 'app-customize-award-section-form',
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
    SettingsComponent,
    TranslateModule,
    AwardsSliderComponent,
  ],
  templateUrl: './customize-award-section-form.component.html',
  styleUrl: './customize-award-section-form.component.scss',
  providers: [AppDialogService],
})
export class CustomizeAwardSectionFormComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  pageTitle = 'Customize Award Section';
  awardSectionForm!: FormGroup;
  currentLanguage = 'en';
  previousLanguage = 'en';
  showLanguageSwitchToast = false;
  result!: any;

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

  @ViewChild(FormActionsComponent) formActionsComponent!: FormActionsComponent;
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  constructor(
    private fb: FormBuilder,
    private dialogService: AppDialogService,
    private customizeService: CustomizeService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.previousLanguage = this.currentLanguage;

    // Set current language from localStorage
    const storedLang = localStorage.getItem('app_lang');
    if (storedLang) {
      this.currentLanguage = storedLang;
    }

    this.loadSection(this.currentLanguage);

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(() => {
      this.setPageTitle();
    });

    this.setPageTitle();
  }

  ngAfterViewInit() {
    // Update settings component after view is initialized
    this.updateSettingsComponent();
  }

  ngOnDestroy(): void {
    this.apiService.setCulture(localStorage.getItem('app_lang') || this.translate.getCurrentLang())
  }

  private setPageTitle(): void {
    this.pageTitle = this.translate.instant('awards_section.form.title');
  }

  initForm(): void {
    this.awardSectionForm = this.fb.group({
      status: [1],
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
      subsection_publish: [true],
      subsections: this.fb.array([]),
    });

    // When subsection_publish changes, toggle validators/enabled on all subsection items
    this.awardSectionForm
      .get('subsection_publish')!
      .valueChanges.subscribe((enabled: boolean) => {
        this.toggleSubsectionFields(enabled);
      });

    // Track changes in form arrays to mark form as dirty
    this.subscribeToFormArrayChanges();
  }

  private subscribeToFormArrayChanges(): void {
    this.subsectionsArray.valueChanges.subscribe(() => {
      this.awardSectionForm.markAsDirty();
    });
  }

  private createSubsectionGroup(data?: any): FormGroup {
    const publishEnabled =
      this.awardSectionForm?.get('subsection_publish')?.value ?? true;

    return this.fb.group({
      id: [data?.id || null],
      title: [
        data?.title || '',
        publishEnabled
          ? [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(50),
            ]
          : [],
      ],
      subtitle: [
        data?.subtitle || '',
        publishEnabled
          ? [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(50),
            ]
          : [],
      ],
    });
  }

  /**
   * Mirrors toggleBenefitsFields() from ServiceFormComponent.
   * When subsection_publish is true  → title & subtitle are required + enabled on every item.
   * When subsection_publish is false → title & subtitle have no validators + disabled on every item.
   */
  private toggleSubsectionFields(enabled: boolean): void {
    const fields = ['title', 'subtitle'];
    this.subsectionsArray.controls.forEach((group) => {
      fields.forEach((field) => {
        const control = group.get(field);
        if (enabled) {
          control?.setValidators([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
          ]);
          control?.enable();
        } else {
          control?.clearValidators();
          control?.disable();
        }
        control?.updateValueAndValidity();
      });
    });
  }

  get subsectionsArray(): FormArray {
    return this.awardSectionForm.get('subsections') as FormArray;
  }

  get isFormValid(): boolean {
    return this.awardSectionForm.valid;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.awardSectionForm.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched));
  }

  isSubsectionFieldInvalid(index: number, fieldName: string): boolean {
    // Only show invalid state when the section-level subsection_publish is true
    const publishEnabled =
      this.awardSectionForm.get('subsection_publish')?.value;
    if (!publishEnabled) {
      return false;
    }

    const field = this.subsectionsArray.at(index)?.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.awardSectionForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.hasError('required')) {
      return this.translate.instant(
        `awards_section.validation.${fieldName}_required`,
      );
    }
    if (field.hasError('minlength')) {
      return this.translate.instant(
        `awards_section.validation.${fieldName}_min`,
      );
    }
    if (field.hasError('maxlength')) {
      return this.translate.instant(
        `awards_section.validation.${fieldName}_max`,
      );
    }
    return '';
  }

  getSubsectionFieldError(index: number, fieldName: string): string {
    const control = this.subsectionsArray.at(index)?.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return this.translate.instant(
        `awards_section.validation.${fieldName}_required`,
      );
    }
    if (control.hasError('minlength')) {
      return this.translate.instant(
        `awards_section.validation.${fieldName}_min`,
      );
    }
    if (control.hasError('maxlength')) {
      return this.translate.instant(
        `awards_section.validation.${fieldName}_max`,
      );
    }
    return '';
  }

  addSubsection(): void {
    if (this.subsectionsArray.length < 10) {
      this.subsectionsArray.push(this.createSubsectionGroup());
    }
  }

  removeSubsection(index: number): void {
    if (this.subsectionsArray.length > 1) {
      this.subsectionsArray.removeAt(index);
    }
  }

  loadSection(lang: string): void {
    console.log(lang);

    this.customizeService.getSection(lang).subscribe({
      next: (res: any) => {
        const section = res.result;
        this.result = section;

        if (section?.localeComplete) {
          Object.entries(section.localeComplete).forEach(
            ([langKey, isComplete]) => {
              const status = isComplete ? 'completed' : 'not-started';
              this.languageStatuses.set(langKey, {
                code: langKey,
                status: status as LanguageStatusType,
              });
            },
          );
          this.updateSettingsComponent();
        }

        // After patching, update the current language status based on localeComplete
        const currentLocaleStatus = section?.localeComplete?.[lang];
        if (currentLocaleStatus === false) {
          this.updateLanguageStatus(lang, 'ongoing');
        } else if (currentLocaleStatus === true) {
          this.updateLanguageStatus(lang, 'completed');
        } else {
          // If localeComplete doesn't have this language, mark as ongoing
          this.updateLanguageStatus(lang, 'ongoing');
        }

        this.awardSectionForm.patchValue({
          name: section?.name || '',
          tagline: section?.tagline || '',
          status: section?.status ? 1 : 0,
          subsection_publish: section?.subsection_publish,
        });

        // Populate subsections
        this.subsectionsArray.clear();
        if (section?.subsections && section.subsections.length > 0) {
          section.subsections.forEach((subsection: any) => {
            this.subsectionsArray.push(this.createSubsectionGroup(subsection));
          });
        } else {
          // Add at least one empty subsection
          this.subsectionsArray.push(this.createSubsectionGroup());
        }

        // Apply the current publish state to all freshly populated items
        this.toggleSubsectionFields(
          this.awardSectionForm.get('subsection_publish')!.value,
        );

        this.awardSectionForm.markAsPristine();
      },
      error: () => {
        this.clearFormForNewLanguage();
        this.updateLanguageStatus(lang, 'ongoing');
      },
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

  submitForm(lang: string, navigateAway = false): void {
    if (!this.awardSectionForm.valid) {
      this.awardSectionForm.markAllAsTouched();
      this.subsectionsArray.controls.forEach((control) =>
        control.markAllAsTouched(),
      );
      return;
    }

    const formData = this.awardSectionForm.value;

    this.customizeService.updateSection(formData, lang).subscribe({
      next: (response: any) => {
        this.updateLanguageStatus(lang, 'completed');
        this.awardSectionForm.markAsPristine();

        if (navigateAway) {
          this.router.navigate(['/awards']);
        }
      },
      error: (err) => console.error('Error saving award section:', err),
    });
  }

  onLanguageChange(event: { newLang: string; oldLang: string }): void {
    if (this.awardSectionForm.valid) {
      if (this.awardSectionForm.dirty) {
        this.showLanguageChangeConfirmation(event);
      } else {
        this.switchLanguage(event.newLang);
      }
    }
  }

  private showLanguageChangeConfirmation(event: {
    newLang: string;
    oldLang: string;
  }): void {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      header: this.translate.instant('awards_section.language_dialog.header'),
      width: '500px',
      data: {
        title: this.translate.instant('awards_section.language_dialog.title'),
        subtitle: this.translate.instant('awards_section.language_dialog.desc'),
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
    if (!this.awardSectionForm.valid) {
      this.awardSectionForm.markAllAsTouched();
      this.subsectionsArray.controls.forEach((control) =>
        control.markAllAsTouched(),
      );
      this.resetLanguage(currentLang);
      return;
    }

    const formData = this.awardSectionForm.value;

    this.customizeService.updateSection(formData, currentLang).subscribe({
      next: () => {
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

    this.loadSection(lang);
  }

  hideLanguageSwitchToast(): void {
    this.showLanguageSwitchToast = false;
  }

  private clearFormForNewLanguage(): void {
    this.awardSectionForm.patchValue({
      name: '',
      tagline: '',
    });

    this.subsectionsArray.clear();
    this.subsectionsArray.push(this.createSubsectionGroup());

    this.awardSectionForm.markAsPristine();
  }

  private resetLanguage(lang: string): void {
    this.formActionsComponent?.revertLanguage();
    this.currentLanguage = lang;
  }

  private commitLanguage(lang: string): void {
    this.formActionsComponent?.confirmLanguage(lang);
  }

  onDiscard(): void {
    this.router.navigate(['/customize']);
  }

  onSave(): void {
    this.submitForm(this.currentLanguage, true);
  }

  getLanguageName(langCode: string): string {
    return this.languageNames[langCode] || langCode.toUpperCase();
  }
}
