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
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppDialogService } from '../../../../shared/services/dialog.service';
import { CustomizeService } from '../../../../services/customize.service';
import { TranslateModule } from '@ngx-translate/core';
import { AwardsSliderComponent } from '../../../../shared/components/awards-slider/awards-slider.component';

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
export class CustomizeAwardSectionFormComponent implements OnInit {
  pageTitle = 'Customize Award Section';
  awardSectionForm!: FormGroup;
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

  @ViewChild(FormActionsComponent) formActionsComponent!: FormActionsComponent;
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  constructor(
    private fb: FormBuilder,
    private dialogService: AppDialogService,
    private customizeService: CustomizeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.previousLanguage = this.currentLanguage;
    this.loadSection(this.currentLanguage);
  }

  initForm(): void {
    this.awardSectionForm = this.fb.group({
      status: [1],
      name: ['', Validators.required],
      tagline: ['', Validators.required],
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
      title: [data?.title || '', publishEnabled ? [Validators.required] : []],
      subtitle: [
        data?.subtitle || '',
        publishEnabled ? [Validators.required] : [],
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
          control?.setValidators([Validators.required]);
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
    return this.awardSectionForm.get(fieldName)?.hasError('required')
      ? 'This field is required'
      : '';
  }

  getSubsectionFieldError(index: number, fieldName: string): string {
    return this.subsectionsArray.at(index)?.get(fieldName)?.hasError('required')
      ? 'This field is required'
      : '';
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

        // If current language is not complete but we're loading it, set to ongoing
        const currentLangStatus = section?.localeComplete?.[lang];
        if (currentLangStatus === false || currentLangStatus === undefined) {
          this.updateLanguageStatus(lang, 'ongoing');
        }

        this.awardSectionForm.patchValue({
          name: section?.name || '',
          tagline: section?.tagline || '',
          status: section?.status ? 1 : 0,
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
          // Navigate to appropriate route
          this.router.navigate(['/customize']);
        }
      },
      error: (err) => console.error('Error saving award section:', err),
    });
  }

  onLanguageChange(event: { newLang: string; oldLang: string }): void {
    if (this.awardSectionForm.dirty) {
      this.showLanguageChangeConfirmation(event);
    } else {
      this.switchLanguage(event.newLang);
    }
  }

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
        cancelSeverity: 'cancel',
        showCancel: true,
      },
    });

    ref.onClose.subscribe((result: any) => {
      if (!result) {
        this.resetLanguage(event.oldLang);
        return;
      }

      if (result.action === 'confirm') {
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
    this.previousLanguage = this.currentLanguage;
    this.currentLanguage = lang;
    this.showLanguageSwitchToast = true;

    this.loadSection(lang);
    this.commitLanguage(lang);
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
