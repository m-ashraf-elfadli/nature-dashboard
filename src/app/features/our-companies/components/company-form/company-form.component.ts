import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { map, startWith } from 'rxjs';
import { TrimInputDirective } from '../../../../core/directives/trim-input.directive';
import { ApiService } from '../../../../core/services/api.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { InputSwitchComponent } from '../../../../shared/components/input-switch/input-switch.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { AppDialogService } from '../../../../shared/services/dialog.service';
import { SOCIAL_PLATFORMS, SocialPlatformOption } from '../../data/social-platforms.constants';
import { LocaleStatus } from '../../../../shared/utils/api-date.util';
import {
  COMPANY_IMAGE_MAX_MB,
  COMPANY_LENGTHS as LEN,
  Company,
  CompanyPayload,
  CompanySocialLink,
} from '../../models/our-companies.model';
import { OurCompaniesService } from '../../services/our-companies.service';
import { deriveCompanyPalette, isValidHexColor } from '../../utils/company-palette.util';

type ToggleSection = 'services' | 'contact' | 'social';

const URL_PATTERN = /^https?:\/\/[^\s.]+\.[^\s]+$/i;
/** The API adds https:// when it is missing (neas.ae → https://neas.ae). */
const WEBSITE_PATTERN = /^(https?:\/\/)?[^\s.\/]+(\.[^\s.\/]+)+(\/\S*)?$/i;

/** Logo and watermark: SVG, PNG or WebP up to 3MB. */
function companyImageValidator(control: AbstractControl): ValidationErrors | null {
  const file = control.value;
  if (!(file instanceof File)) return null;
  if (!/\.(svg|png|webp)$/i.test(file.name)) return { imageType: true };
  if (file.size > COMPANY_IMAGE_MAX_MB * 1024 * 1024) return { imageSize: true };
  return null;
}

function hexColorValidator(control: AbstractControl): ValidationErrors | null {
  return !control.value || isValidHexColor(control.value) ? null : { hexColor: true };
}

@Component({
  selector: 'app-company-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    SelectModule,
    MultiSelectModule,
    ColorPickerModule,
    TrimInputDirective,
    PageHeaderComponent,
    FormActionsComponent,
    SettingsComponent,
    GalleryUploadComponent,
    InputSwitchComponent,
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
  providers: [AppDialogService],
})
export class CompanyFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly service = inject(OurCompaniesService);
  private readonly apiService = inject(ApiService);
  private readonly dialogService = inject(AppDialogService);
  private readonly translate = inject(TranslateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(FormActionsComponent) formActions?: FormActionsComponent;

  readonly platforms = SOCIAL_PLATFORMS;
  readonly companyId = signal<string | null>(this.route.snapshot.paramMap.get('id'));
  readonly isEdit = computed(() => !!this.companyId());
  readonly currentLanguage = signal<string>(localStorage.getItem('app_lang') || 'en');
  readonly showLanguageToast = signal(false);
  readonly localeStatus = signal<{ en: LocaleStatus; ar: LocaleStatus }>({ en: 1, ar: 0 });
  readonly serviceOptions = signal<{ id: string; name: string }[]>([]);

  readonly form: FormGroup = this.fb.group({
    status: [1],
    name: ['', [Validators.required, Validators.minLength(LEN.name.min), Validators.maxLength(LEN.name.max)]],
    overview: [
      '',
      [Validators.required, Validators.minLength(LEN.overview.min), Validators.maxLength(LEN.overview.max)],
    ],
    services_enabled: [true],
    // Required while the Services card is on (the control is disabled when it is off).
    service_ids: [[] as string[], Validators.required],
    contact_enabled: [true],
    location: ['', [Validators.maxLength(LEN.location.max)]],
    email: ['', [Validators.email]],
    website: ['', [Validators.pattern(WEBSITE_PATTERN)]],
    social_enabled: [true],
    social_links: this.fb.array([]),
    logo: [null as File | string | null, [Validators.required, companyImageValidator]],
    watermark: [null as File | string | null, [companyImageValidator]],
    card_color: ['', [Validators.required, hexColorValidator]],
  });

  /** Live preview of the three colors the website will derive. */
  private readonly cardColor = toSignal(
    this.form.get('card_color')!.valueChanges.pipe(
      startWith(this.form.get('card_color')!.value),
      map((v: string) => (isValidHexColor(v) ? v : null)),
    ),
    { initialValue: null },
  );
  readonly palette = computed(() => {
    const color = this.cardColor();
    return color ? deriveCompanyPalette(color) : null;
  });

  get socialLinks(): FormArray {
    return this.form.get('social_links') as FormArray;
  }

  ngOnInit(): void {
    (['services', 'contact', 'social'] as ToggleSection[]).forEach((section) =>
      this.form
        .get(`${section}_enabled`)!
        .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.applyToggle(section)),
    );
    this.loadServiceOptions(this.currentLanguage());

    if (this.isEdit()) {
      this.load(this.currentLanguage());
    } else {
      this.socialLinks.push(this.createSocialLink());
      // A new company is being written in the current language.
      this.localeStatus.set(this.currentLanguage() === 'ar' ? { en: 0, ar: 1 } : { en: 1, ar: 0 });
    }
  }

  ngOnDestroy(): void {
    this.apiService.setCulture(localStorage.getItem('app_lang') || this.translate.getCurrentLang());
  }

  // ---------- loading ----------

  private loadServiceOptions(lang: string): void {
    this.service.getServiceOptions(lang).subscribe({
      next: (options) => this.serviceOptions.set(options),
      error: () => this.serviceOptions.set([]),
    });
  }

  private load(lang: string): void {
    const id = this.companyId();
    if (!id) return;
    this.service.getCompany(id, lang).subscribe({
      next: (company) => {
        this.patchForm(company);
        this.localeStatus.set(company.localeStatus);
        this.cdr.markForCheck();
      },
      error: () => this.router.navigate(['/our-companies']),
    });
  }

  private patchForm(company: Company): void {
    this.form.patchValue(
      {
        status: company.status ?? 1,
        name: company.name ?? '',
        overview: company.overview ?? '',
        services_enabled: company.services_enabled ?? true,
        service_ids: company.service_ids ?? [],
        contact_enabled: company.contact_enabled ?? true,
        location: company.location ?? '',
        email: company.email ?? '',
        website: company.website ?? '',
        social_enabled: company.social_enabled ?? true,
        logo: company.logo,
        watermark: company.watermark,
        card_color: company.card_color ?? '',
      },
      { emitEvent: false },
    );
    // valueChanges were silenced above; push the color so the preview updates.
    this.form.get('card_color')!.setValue(company.card_color ?? '');

    this.socialLinks.clear({ emitEvent: false });
    const links = company.social_links?.length ? company.social_links : [null];
    links.forEach((link) => this.socialLinks.push(this.createSocialLink(link), { emitEvent: false }));

    (['services', 'contact', 'social'] as ToggleSection[]).forEach((s) => this.applyToggle(s));
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  // ---------- sections ----------

  /** A switched-off section is hidden on the website, so its fields are not validated. */
  private applyToggle(section: ToggleSection): void {
    const enabled = !!this.form.get(`${section}_enabled`)!.value;
    const controls: Record<ToggleSection, string[]> = {
      services: ['service_ids'],
      contact: ['location', 'email', 'website'],
      social: ['social_links'],
    };
    controls[section].forEach((name) => {
      const control = this.form.get(name)!;
      if (enabled) control.enable({ emitEvent: false });
      else control.disable({ emitEvent: false });
    });
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  isEnabled(section: ToggleSection): boolean {
    return !!this.form.get(`${section}_enabled`)!.value;
  }

  // ---------- social links ----------

  private createSocialLink(link?: CompanySocialLink | null): FormGroup {
    return this.fb.group({
      // Existing links keep their id so the API updates them instead of recreating them.
      id: [link?.id ?? null],
      platform: [link?.platform ?? null, Validators.required],
      url: [link?.url ?? '', [Validators.required, Validators.pattern(URL_PATTERN)]],
    });
  }

  /** Each platform can be used once: hide platforms already picked in other rows. */
  availablePlatforms(index: number): SocialPlatformOption[] {
    const taken = this.socialLinks.controls
      .map((c, i) => (i === index ? null : c.get('platform')!.value))
      .filter(Boolean);
    return this.platforms.filter((p) => !taken.includes(p.value));
  }

  platformOf(value: string | null): SocialPlatformOption | undefined {
    return this.platforms.find((p) => p.value === value);
  }

  get canAddSocialLink(): boolean {
    return this.isEnabled('social') && this.socialLinks.length < this.platforms.length;
  }

  addSocialLink(): void {
    if (this.canAddSocialLink) {
      this.socialLinks.push(this.createSocialLink());
      this.form.markAsDirty();
    }
  }

  removeSocialLink(index: number): void {
    this.socialLinks.removeAt(index);
    if (!this.socialLinks.length) this.socialLinks.push(this.createSocialLink());
    this.form.markAsDirty();
  }

  // ---------- color ----------

  onColorPicked(value: string): void {
    const control = this.form.get('card_color')!;
    control.setValue((value || '').toUpperCase());
    control.markAsDirty();
  }

  normalizeHex(): void {
    const control = this.form.get('card_color')!;
    let value = (control.value || '').trim();
    if (value && !value.startsWith('#')) value = '#' + value;
    control.setValue(value.toUpperCase());
  }

  // ---------- saving ----------

  onSave(): void {
    this.save(this.currentLanguage(), () => this.router.navigate(['/our-companies']));
  }

  onDiscard(): void {
    this.router.navigate(['/our-companies']);
  }

  private save(lang: string, afterSave: (id: string) => void): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.buildPayload();
    const id = this.companyId();
    const request$ = id
      ? this.service.updateCompany(id, payload, lang)
      : this.service.createCompany(payload, lang);
    request$.subscribe({ next: (company) => afterSave(company.id ?? id) });
  }

  private buildPayload(): CompanyPayload {
    const v = this.form.getRawValue();
    return {
      status: v.status,
      name: v.name,
      overview: v.overview,
      services_enabled: !!v.services_enabled,
      // Sent even while a card is switched off, so its content survives turning it back on.
      service_ids: v.service_ids ?? [],
      contact_enabled: !!v.contact_enabled,
      location: v.location ?? '',
      email: v.email ?? '',
      website: v.website ?? '',
      social_enabled: !!v.social_enabled,
      social_links: (v.social_links ?? []).filter((l: CompanySocialLink) => l.platform && l.url),
      logo: v.logo,
      watermark: v.watermark,
      card_color: v.card_color,
    };
  }

  // ---------- language switching ----------

  onLanguageChange(event: { newLang: string; oldLang: string }): void {
    if (this.form.dirty || !this.isEdit()) {
      // Unsaved changes, or a new company that must be created before translating it.
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
        this.save(event.oldLang, (id) => {
          if (!this.companyId()) {
            this.companyId.set(id);
            // Keep the URL in sync so a refresh opens the saved company
            // (replaceState: navigating would recreate this component).
            this.location.replaceState(`/our-companies/edit/${id}`);
          }
          this.switchLanguage(event.newLang);
        });
      } else if (result?.action === 'cancel' && this.isEdit()) {
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

  /** First visible error of a field as a translation key + params (null when valid). */
  fieldError(
    path: string | (string | number)[],
    fallbackKey: string,
  ): { key: string; params?: Record<string, number> } | null {
    if (!this.hasError(path)) return null;
    const errors = this.form.get(path)!.errors ?? {};
    const v = 'our_companies.form.validation.';
    if (errors['minlength']) return { key: v + 'min_length', params: { min: errors['minlength'].requiredLength } };
    if (errors['maxlength']) return { key: v + 'max_length', params: { max: errors['maxlength'].requiredLength } };
    if (errors['imageType']) return { key: v + 'image_type' };
    if (errors['imageSize']) return { key: v + 'image_size', params: { max: COMPANY_IMAGE_MAX_MB } };
    return { key: fallbackKey };
  }

  errorOf(path: string | (string | number)[], error: string): boolean {
    return this.hasError(path) && !!this.form.get(path)?.hasError(error);
  }
}
