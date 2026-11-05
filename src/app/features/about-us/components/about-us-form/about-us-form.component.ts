import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { ApiService } from '../../../../core/services/api.service';
import { TrimInputDirective } from '../../../../core/directives/trim-input.directive';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { InputSwitchComponent } from '../../../../shared/components/input-switch/input-switch.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { AppDialogService } from '../../../../shared/services/dialog.service';
import { LocaleStatus } from '../../../../shared/utils/api-date.util';
import {
  ABOUT_US_LENGTHS as LEN,
  ABOUT_US_LIMITS,
  AboutUs,
  AboutUsHighlight,
  AboutUsPayload,
  AboutUsStatistic,
} from '../../models/about-us.model';
import { AboutUsService } from '../../services/about-us.service';

type RepeatableSection = 'highlights' | 'statistics';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

/** The API accepts JPG or PNG founder images up to 3MB. */
function founderImageValidator(control: AbstractControl): ValidationErrors | null {
  const file = control.value;
  if (!(file instanceof File)) return null;
  if (!/\.(jpe?g|png)$/i.test(file.name)) return { imageType: true };
  if (file.size > MAX_IMAGE_BYTES) return { imageSize: true };
  return null;
}

@Component({
  selector: 'app-about-us-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    TrimInputDirective,
    PageHeaderComponent,
    FormActionsComponent,
    SettingsComponent,
    GalleryUploadComponent,
    InputSwitchComponent,
  ],
  templateUrl: './about-us-form.component.html',
  styleUrl: './about-us-form.component.scss',
  providers: [AppDialogService],
})
export class AboutUsFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(AboutUsService);
  private readonly apiService = inject(ApiService);
  private readonly dialogService = inject(AppDialogService);
  private readonly translate = inject(TranslateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(FormActionsComponent) formActions?: FormActionsComponent;

  readonly limits = ABOUT_US_LIMITS;
  readonly lengths = LEN;
  /** Read-only until the user clicks Edit (Figma: view → edit → save → view). */
  readonly isEditing = signal(false);
  readonly currentLanguage = signal<string>(localStorage.getItem('app_lang') || 'en');
  readonly showLanguageToast = signal(false);
  readonly lastUpdated = signal<string | null>(null);
  readonly localeStatus = signal<{ en: LocaleStatus; ar: LocaleStatus }>({ en: 0, ar: 0 });

  readonly form: FormGroup = this.fb.group({
    status: [1],
    title: ['', [Validators.required, Validators.minLength(LEN.title.min), Validators.maxLength(LEN.title.max)]],
    description: [
      '',
      [Validators.required, Validators.minLength(LEN.description.min), Validators.maxLength(LEN.description.max)],
    ],
    highlights_enabled: [true],
    highlights: this.fb.array([]),
    statistics_enabled: [true],
    statistics: this.fb.array([]),
    founder_image: [null as File | string | null, [Validators.required, founderImageValidator]],
    founder_name: [
      '',
      [Validators.required, Validators.minLength(LEN.founderName.min), Validators.maxLength(LEN.founderName.max)],
    ],
    founder_title: [
      '',
      [Validators.required, Validators.minLength(LEN.founderTitle.min), Validators.maxLength(LEN.founderTitle.max)],
    ],
  });

  get highlights(): FormArray {
    return this.form.get('highlights') as FormArray;
  }

  get statistics(): FormArray {
    return this.form.get('statistics') as FormArray;
  }

  ngOnInit(): void {
    (['highlights', 'statistics'] as RepeatableSection[]).forEach((section) =>
      this.form
        .get(`${section}_enabled`)!
        .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.applySectionToggle(section)),
    );
    this.load(this.currentLanguage());
  }

  ngOnDestroy(): void {
    // The service switches the API culture per request; restore the UI language.
    this.apiService.setCulture(localStorage.getItem('app_lang') || this.translate.getCurrentLang());
  }

  // ---------- loading ----------

  private load(lang: string): void {
    this.service.getAboutUs(lang).subscribe({
      next: (about) => {
        this.patchForm(about);
        this.lastUpdated.set(about.updated_at);
        this.localeStatus.set(about.localeStatus);
        this.cdr.markForCheck();
      },
      error: () => this.patchForm(null),
    });
  }

  private patchForm(about: AboutUs | null): void {
    this.form.patchValue(
      {
        status: about?.status ?? 1,
        title: about?.title ?? '',
        description: about?.description ?? '',
        highlights_enabled: about?.highlights_enabled ?? true,
        statistics_enabled: about?.statistics_enabled ?? true,
        founder_image: about?.founder_image ?? null,
        founder_name: about?.founder_name ?? '',
        founder_title: about?.founder_title ?? '',
      },
      { emitEvent: false },
    );

    this.highlights.clear({ emitEvent: false });
    const highlights = about?.highlights?.length ? about.highlights : [null];
    highlights.forEach((h) => this.highlights.push(this.createHighlight(h), { emitEvent: false }));

    this.statistics.clear({ emitEvent: false });
    const statistics = about?.statistics?.length ? about.statistics : [null];
    statistics.forEach((s) => this.statistics.push(this.createStatistic(s), { emitEvent: false }));

    this.applyEditState();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private createHighlight(data?: AboutUsHighlight | null): FormGroup {
    const { highlightTitle: t, highlightDescription: d } = LEN;
    return this.fb.group({
      // Kept so the API updates the row instead of recreating it (it holds the other language too).
      id: [data?.id ?? null],
      title: [data?.title ?? '', [Validators.required, Validators.minLength(t.min), Validators.maxLength(t.max)]],
      description: [
        data?.description ?? '',
        [Validators.required, Validators.minLength(d.min), Validators.maxLength(d.max)],
      ],
    });
  }

  private createStatistic(data?: AboutUsStatistic | null): FormGroup {
    const { metricValue: v, metricLabel: l } = LEN;
    return this.fb.group({
      id: [data?.id ?? null],
      value: [data?.value ?? '', [Validators.required, Validators.maxLength(v.max)]],
      label: [data?.label ?? '', [Validators.required, Validators.minLength(l.min), Validators.maxLength(l.max)]],
    });
  }

  // ---------- view / edit mode ----------

  /** Read-only: everything disabled. Editing: enabled, except items of a switched-off section. */
  private applyEditState(): void {
    if (!this.isEditing()) {
      this.form.disable({ emitEvent: false });
      return;
    }
    this.form.enable({ emitEvent: false });
    this.applySectionToggle('highlights');
    this.applySectionToggle('statistics');
  }

  /** A switched-off section is hidden on the website, so its fields are not validated. */
  private applySectionToggle(section: RepeatableSection): void {
    if (!this.isEditing()) return;
    const enabled = !!this.form.get(`${section}_enabled`)!.value;
    const array = this.form.get(section) as FormArray;
    if (enabled) array.enable({ emitEvent: false });
    else array.disable({ emitEvent: false });
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  isSectionEnabled(section: RepeatableSection): boolean {
    return !!this.form.get(`${section}_enabled`)!.value;
  }

  /** The primary header button: "Edit" in view mode, "Save" while editing. */
  onPrimaryAction(): void {
    if (!this.isEditing()) {
      this.isEditing.set(true);
      this.applyEditState();
      return;
    }
    this.save(this.currentLanguage());
  }

  get canSubmit(): boolean {
    return !this.isEditing() || this.form.valid;
  }

  // ---------- repeatable rows ----------

  addHighlight(): void {
    if (this.highlights.length < this.limits.highlights) {
      this.highlights.push(this.createHighlight());
      this.form.markAsDirty();
    }
  }

  removeHighlight(index: number): void {
    if (this.highlights.length > 1) {
      this.highlights.removeAt(index);
      this.form.markAsDirty();
    }
  }

  addStatistic(): void {
    if (this.statistics.length < this.limits.statistics) {
      this.statistics.push(this.createStatistic());
      this.form.markAsDirty();
    }
  }

  removeStatistic(index: number): void {
    if (this.statistics.length > 1) {
      this.statistics.removeAt(index);
      this.form.markAsDirty();
    }
  }

  // ---------- saving ----------

  private save(lang: string, afterSave?: () => void): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.service.updateAboutUs(this.buildPayload(), lang).subscribe({
      next: (saved) => {
        this.isEditing.set(false);
        if (afterSave) {
          afterSave();
        } else {
          this.patchForm(saved);
          this.lastUpdated.set(saved.updated_at);
          this.localeStatus.set(saved.localeStatus);
        }
      },
    });
  }

  private buildPayload(): AboutUsPayload {
    const v = this.form.getRawValue();
    return {
      status: v.status,
      title: v.title,
      description: v.description,
      highlights_enabled: !!v.highlights_enabled,
      highlights: v.highlights,
      statistics_enabled: !!v.statistics_enabled,
      statistics: v.statistics,
      founder_image: v.founder_image,
      founder_name: v.founder_name,
      founder_title: v.founder_title,
    };
  }

  // ---------- language switching ----------

  onLanguageChange(event: { newLang: string; oldLang: string }): void {
    if (this.isEditing() && this.form.dirty) {
      this.confirmLanguageChange(event);
    } else {
      this.switchLanguage(event.newLang);
    }
  }

  private confirmLanguageChange(event: { newLang: string; oldLang: string }): void {
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

    ref.onClose.subscribe((result: { action?: string } | undefined) => {
      if (result?.action === 'confirm') {
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          this.formActions?.revertLanguage();
          return;
        }
        this.save(event.oldLang, () => this.switchLanguage(event.newLang));
      } else if (result?.action === 'cancel') {
        this.switchLanguage(event.newLang);
      } else {
        this.formActions?.revertLanguage();
      }
    });
  }

  private switchLanguage(lang: string): void {
    this.currentLanguage.set(lang);
    this.formActions?.confirmLanguage(lang);
    this.showLanguageToast.set(true);
    this.load(lang);
  }


  // ---------- validation helpers ----------

  hasError(path: string | (string | number)[]): boolean {
    const control = this.form.get(path);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  get founderImageError(): string {
    const control = this.form.get('founder_image')!;
    if (control.hasError('imageType')) return 'about_us.validation.founder_image_type';
    if (control.hasError('imageSize')) return 'about_us.validation.image_size';
    return 'about_us.validation.founder_image';
  }

  /** First visible error of a field as a translation key + params (null when valid). */
  fieldError(
    path: string | (string | number)[],
    requiredKey: string,
  ): { key: string; params?: Record<string, number> } | null {
    if (!this.hasError(path)) return null;
    const errors = this.form.get(path)!.errors ?? {};
    if (errors['required']) return { key: requiredKey };
    if (errors['minlength']) return { key: 'about_us.validation.min_length', params: { min: errors['minlength'].requiredLength } };
    if (errors['maxlength']) return { key: 'about_us.validation.max_length', params: { max: errors['maxlength'].requiredLength } };
    if (errors['imageType']) return { key: 'about_us.validation.founder_image_type' };
    if (errors['imageSize']) return { key: 'about_us.validation.image_size', params: { max: 3 } };
    return { key: requiredKey };
  }

  errorOf(path: string | (string | number)[], error: string): boolean {
    return this.hasError(path) && !!this.form.get(path)?.hasError(error);
  }
}
