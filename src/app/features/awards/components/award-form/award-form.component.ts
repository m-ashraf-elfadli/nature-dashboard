import {
  Component,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { EditorModule } from 'primeng/editor';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { MessageModule } from 'primeng/message';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AwardsService } from '../../../../services/awards.service';
import { environment } from '../../../../../environments/environment';
import { Award } from '../../models/awards.interface';

type LanguageStatusType = 'not-started' | 'ongoing' | 'completed';

const STATUS_MAP = {
  'not-started': 0,
  ongoing: 1,
  completed: 2,
} as const;

@Component({
  selector: 'app-award-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    FormActionsComponent,
    TranslateModule,
    InputTextModule,
    DatePickerModule,
    EditorModule,
    GalleryUploadComponent,
    SettingsComponent,
    MessageModule,
  ],
  templateUrl: './award-form.component.html',
  styleUrl: './award-form.component.scss',
})
export class AwardFormComponent implements OnInit, AfterViewInit {
  @ViewChild(FormActionsComponent) formActionsComponent!: FormActionsComponent;
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(AwardsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  awardId: string = '';
  isEditMode: boolean = false;
  awardData: Award = {} as Award;
  mediaUrl: string = environment.mediaUrl;
  ref: DynamicDialogRef | undefined;
  currentLanguage = 'en';
  previousLanguage = 'en';
  showLanguageSwitchToast = false;
  isFirstTimeToSend: boolean = false;
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

  ngOnInit(): void {
    this.initForm();

    // Set current language from localStorage
    const storedLang = localStorage.getItem('app_lang');
    if (storedLang) {
      this.currentLanguage = storedLang;
    }

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.awardId = params['id'];
        this.getAwardById(this.awardId, this.currentLanguage);
      } else {
        // In create mode, mark the current language as ongoing
        this.updateLanguageStatus(this.currentLanguage, 'ongoing');
      }
    });
  }

  ngAfterViewInit() {
    // Update settings component after view is initialized
    this.updateSettingsComponent();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
      award_date: [null, Validators.required],
      organizations_logos: [null],
      status: [1, Validators.required],
    });
  }

  getAwardById(id: string, culture: string) {
    this.service.getById(id, culture).subscribe({
      next: (res: any) => {
        if (!res.result) {
          // No data for this language, mark as ongoing and clear form
          this.updateLanguageStatus(culture, 'ongoing');
          this.clearFormForNewLanguage();
          return;
        }

        this.awardData = res.result;
        this.patchValues(this.awardData);
        this.form.markAsPristine();

        // After patching, update the current language status based on localeComplete
        const currentLocaleStatus = res.result.localeComplete?.[culture];
        if (currentLocaleStatus === false) {
          this.updateLanguageStatus(culture, 'ongoing');
        } else if (currentLocaleStatus === true) {
          this.updateLanguageStatus(culture, 'completed');
        } else {
          // If localeComplete doesn't have this language, mark as ongoing
          this.updateLanguageStatus(culture, 'ongoing');
        }
      },
      error: (err) => {
        console.error('Failed to load award', err);
        // If loading fails for this language, mark as ongoing and clear form
        this.updateLanguageStatus(culture, 'ongoing');
        this.clearFormForNewLanguage();
      },
    });
  }

  patchValues(data: Award) {
    if (!data) return;
    this.awardData = data;
    this.isEditMode = true;

    if (data.localeComplete) {
      Object.entries(data.localeComplete).forEach(([langKey, isComplete]) => {
        const status = isComplete ? 'completed' : 'not-started';
        this.languageStatuses.set(langKey, {
          code: langKey,
          status: status as LanguageStatusType,
        });
      });
      this.updateSettingsComponent();
    }

    const parseDate = (d?: string | null): Date | null => {
      if (!d) return null;
      const parts = d.split('/');
      if (parts.length === 3) {
        return new Date(+parts[2], +parts[1] - 1, +parts[0]);
      }
      return new Date(d);
    };

    this.form.patchValue({
      name: data.name || '',
      description: data.description || '',
      award_date: parseDate(data.awardDate),
      status: data.status ? 1 : 0,
    });

    // Images
    if (data.image) {
      this.form.get('image')?.setValue(this.mediaUrl + data.image);
    }
    if (data.organizationLogos && data.organizationLogos.length) {
      const logos = data.organizationLogos.map(
        (logo: any) => this.mediaUrl + logo.url,
      );
      this.form.get('organizations_logos')?.setValue(logos);
    }
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

  private clearFormForNewLanguage(): void {
    this.form.patchValue({
      name: '',
      description: '',
    });

    this.form.markAsPristine();
  }

  onDiscard(event: Event) {
    this.router.navigate(['/awards']);
  }

  onSave() {
    this.isFirstTimeToSend = false;
    this.submitForm(true, this.currentLanguage);
  }

  submitForm(isNavigateOut: boolean = false, culture?: string) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.buildFormData();
    const request = this.isEditMode
      ? this.service.update(this.awardId, formData, culture)
      : this.service.create(formData, culture);

    request.subscribe({
      next: (res) => {
        if (!this.isEditMode) {
          this.awardId = res.result.id;
          this.isEditMode = true;
        }

        // Update language status to completed after successful save
        if (culture) {
          this.updateLanguageStatus(culture, 'completed');
        }
        this.form.markAsPristine();

        if (isNavigateOut) {
          this.router.navigate(['/awards']);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  buildFormData(): FormData {
    const formData = new FormData();
    const value = this.form.value;

    if (this.isEditMode) {
      formData.append('id', this.awardId);
    }
    formData.append('name', value.name);
    formData.append('description', value.description);
    formData.append('award_date', this.formatDate(value.award_date));
    formData.append('status', value.status);

    // Single image
    if (value.image instanceof File) {
      formData.append('image', value.image);
    }

    // Organizations logos - send both new files and existing paths in the same array
    if (value.organizations_logos?.length) {
      value.organizations_logos.forEach(
        (item: File | string, index: number) => {
          if (item instanceof File) {
            // New file upload
            formData.append(`organizations_logos[${index}]`, item);
          } else if (typeof item === 'string') {
            // Existing file - send as string (relative path)
            const relativePath = item.replace(this.mediaUrl, '');
            formData.append(`organizations_logos[${index}]`, relativePath);
          }
        },
      );
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

  hasError(controlName: string, errorName?: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;
    if (errorName) {
      return !!(control.touched && control.hasError(errorName));
    }
    return !!(control.touched && control.invalid);
  }

  onLanguageChange(event: { newLang: string; oldLang: string }) {
    // Store the languages
    this.previousLanguage = event.oldLang;

    if (this.isEditMode && this.form.valid) {
      if (this.form.dirty) {
        this.showLanguageChangeConfirmation(event);
      } else {
        this.switchLanguage(event.newLang);
      }
      return;
    }

    // For new awards, validate before switching
    if (this.form.invalid) {
      setTimeout(() => {
        this.formActionsComponent.revertLanguage();
        this.form.markAllAsTouched();
      }, 0);
      return;
    }

    // Form is valid, show confirmation to save
    if (this.form.dirty) {
      this.showLanguageChangeConfirmation(event);
    } else {
      this.switchLanguage(event.newLang);
    }
  }

  private showLanguageChangeConfirmation(event: {
    newLang: string;
    oldLang: string;
  }): void {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
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

    this.ref.onClose.subscribe((result: any) => {
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
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.resetLanguage(currentLang);
      return;
    }

    const formData = this.buildFormData();
    const request = this.isEditMode
      ? this.service.update(this.awardId, formData, currentLang)
      : this.service.create(formData, currentLang);

    request.subscribe({
      next: (res) => {
        if (!this.isEditMode) {
          this.awardId = res.result.id;
          this.isEditMode = true;
        }

        this.updateLanguageStatus(currentLang, 'completed');
        this.switchLanguage(newLang);
      },
      error: () => this.resetLanguage(currentLang),
    });
  }

  private switchLanguage(lang: string): void {
    this.isFirstTimeToSend = true;
    this.previousLanguage = this.currentLanguage;
    this.currentLanguage = lang;
    this.showLanguageSwitchToast = true;

    this.commitLanguage(lang);

    // Mark as ongoing when switching to it (unless already completed)
    const currentStatus = this.languageStatuses.get(lang)?.status;
    if (currentStatus !== 'completed') {
      this.updateLanguageStatus(lang, 'ongoing');
    }

    if (this.isEditMode && this.awardId) {
      this.getAwardById(this.awardId, lang);
    } else {
      this.clearFormForNewLanguage();
    }
  }

  hideLanguageSwitchToast(): void {
    this.showLanguageSwitchToast = false;
  }

  private resetLanguage(lang: string): void {
    this.formActionsComponent?.revertLanguage();
    this.currentLanguage = lang;
  }

  private commitLanguage(lang: string): void {
    this.formActionsComponent?.confirmLanguage(lang);
  }

  getLanguageName(langCode: string): string {
    return this.languageNames[langCode] || langCode.toUpperCase();
  }

  showConfirmDialog(lang: string) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Select a Product',
      width: '40vw',
      modal: true,
      data: {
        title: 'projects.form.language_dialog.header',
        subtitle: 'projects.form.language_dialog.desc',
        confirmText: 'projects.form.btns.save',
        cancelText: 'general.cancel',
        confirmSeverity: 'success',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: { lang },
      },
    });
    this.ref.onClose.subscribe(
      (product: { action: string; data: { lang: string } }) => {
        if (product) {
          if (product.action === 'confirm') {
            this.submitForm(false, product.data.lang);
          } else if (product.action === 'cancel') {
            // Discard changes and switch language
            this.switchLanguage(this.previousLanguage === 'en' ? 'ar' : 'en');
          }
        } else {
          // Dialog was closed without action - reset to previous language
          this.resetLanguage(this.previousLanguage);
        }
      },
    );
  }
}
