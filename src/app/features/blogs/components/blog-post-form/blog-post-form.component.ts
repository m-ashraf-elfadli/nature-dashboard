import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { merge, startWith, Subscription } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { EditorModule } from 'primeng/editor';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TrimInputDirective } from '../../../../core/directives/trim-input.directive';
import { BlogsService } from '../../services/blogs.service';
import { environment } from '../../../../../environments/environment';
import {
  BlogPostFormPayload,
  BlogPostSection,
} from '../../models/blogs.model';

type LanguageStatusType = 'not-started' | 'ongoing' | 'completed';

const STATUS_MAP = {
  'not-started': 0,
  ongoing: 1,
  completed: 2,
} as const;

@Component({
  selector: 'app-blog-post-form',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    FormActionsComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    InputText,
    SelectModule,
    MessageModule,
    EditorModule,
    InputSwitchModule,
    GalleryUploadComponent,
    SettingsComponent,
    TrimInputDirective,
  ],
  templateUrl: './blog-post-form.component.html',
  styleUrl: './blog-post-form.component.scss',
})
export class BlogPostFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(FormActionsComponent)
  formActionsComponent!: FormActionsComponent;
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BlogsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly dialogService = inject(DialogService);
  private readonly cdr = inject(ChangeDetectorRef);
  private categoriesSub?: Subscription;
  private titleStatusSub?: Subscription;
  private confirmDialogRef?: DynamicDialogRef;

  form!: FormGroup;
  mediaUrl: string = environment.mediaUrl;
  sectionTagInput = '';
  postId = '';
  isEditMode = false;
  categoryOptions: { id: string; name: string }[] = [];
  currentLanguage: WritableSignal<string> = signal('en');
  previousLanguage = 'en';
  isFirstTimeToSend = false;
  languageStatuses = new Map<
    string,
    { code: string; status: LanguageStatusType }
  >([
    ['en', { code: 'en', status: 'not-started' }],
    ['ar', { code: 'ar', status: 'not-started' }],
  ]);

  ngOnInit(): void {
    const stored = localStorage.getItem('app_lang');
    if (stored === 'en' || stored === 'ar') {
      this.currentLanguage.set(stored);
    }
    this.initForm();
    this.loadCategories(this.currentLanguage());
    this.titleStatusSub = merge(
      this.form.get('title_en')!.valueChanges,
      this.form.get('title_ar')!.valueChanges,
    )
      .pipe(startWith(null))
      .subscribe(() => this.syncLanguageStatusFromTitles());
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.postId = id;
        this.loadPost(id, this.currentLanguage());
      } else {
        this.isEditMode = false;
        this.postId = '';
        this.resetFormForCreate();
      }
    });
  }

  ngAfterViewInit(): void {
    this.updateSettingsComponent();
  }

  ngOnDestroy(): void {
    this.categoriesSub?.unsubscribe();
    this.titleStatusSub?.unsubscribe();
  }

  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  get sectionTags(): FormArray {
    return this.form.get('section_tags') as FormArray;
  }

  get currentTitleControlName(): 'title_en' | 'title_ar' {
    return 'title_en';
  }

  private loadCategories(culture?: string): void {
    this.categoriesSub?.unsubscribe();
    this.categoriesSub = this.service.getCategoriesForDropdown(culture).subscribe({
      next: (opts) => (this.categoryOptions = opts),
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      title_en: ['', [Validators.maxLength(300)]],
      title_ar: ['', [Validators.maxLength(300)]],
      category_id: [null, Validators.required],
      image: [null, Validators.required],
      status: [1, Validators.required],
      section_tags: this.fb.array([]),
      sections: this.fb.array([this.createSectionGroup()]),
    });
    this.updateActiveTitleValidators(this.currentLanguage());
  }

  private sectionGroupValidator = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const g = control as FormGroup;
    if (!g.get('enabled')?.value) {
      return null;
    }
    const t = g.get('title')?.value?.trim();
    return t ? null : { sectionTitleRequired: true };
  };

  private createSectionGroup(data?: BlogPostSection): FormGroup {
    const raw: any = data || {};
    const enabledRaw = raw.enabled ?? raw.status;
    const enabled =
      enabledRaw === undefined || enabledRaw === null
        ? true
        : enabledRaw === true || enabledRaw === 1 || enabledRaw === '1';
    const sectionImage = String(raw.image || '').trim();
    return this.fb.group(
      {
        id: [raw.id ?? null],
        enabled: [enabled],
        title: [raw.title ?? ''],
        subtitle: [raw.subtitle_html ?? raw.subtitle ?? ''],
        image: [sectionImage || null],
        quote: [raw.quote ?? ''],
      },
      { validators: this.sectionGroupValidator },
    );
  }

  private resetFormForCreate(): void {
    this.sections.clear();
    this.sections.push(this.createSectionGroup());
    this.sectionTags.clear();
    this.sectionTagInput = '';
    this.form.patchValue({
      title_en: '',
      title_ar: '',
      category_id: null,
      image: null,
      status: 1,
    });
    this.form.markAsPristine();
    this.syncLanguageStatusFromTitles();
  }

  private loadPost(id: string, culture?: string): void {
    this.service.getPostById(id, culture).subscribe({
      next: (res: any) => {
        const d = res?.result;
        if (!d) return;
        this.sections.clear();
        this.sectionTags.clear();
        const rawSections = Array.isArray(d.sections)
          ? d.sections
          : d.sections && typeof d.sections === 'object'
            ? Object.values(d.sections)
            : [];
        if (rawSections.length) {
          rawSections.forEach((s: any) => {
            const sectionImage = String(s?.image || '').trim();
            const group = this.createSectionGroup();
            group.patchValue(
              {
                id: s?.id ?? null,
                enabled: s?.enabled ?? s?.status ?? true,
                title: s?.title ?? '',
                subtitle: s?.subtitle_html ?? s?.subtitle ?? '',
                image:
                  sectionImage && !sectionImage.startsWith('http')
                    ? `${this.mediaUrl}${sectionImage}`
                    : sectionImage || null,
                quote: s?.quote ?? '',
              },
              { emitEvent: false },
            );
            this.sections.push(group);
          });
        } else {
          this.sections.push(this.createSectionGroup());
        }
        this.sections.controls.forEach((_, idx) => this.applySectionEnabledState(idx));
        this.hydrateSectionTags(
          rawSections as any,
          d.tags ?? d.section_tags ?? d.sectionTags ?? d.tag,
        );
        const localizedTitles = this.resolveLocalizedTitles(d);
        this.form.patchValue({
          title_en: localizedTitles.title_en,
          title_ar: localizedTitles.title_ar,
          category_id: d.category_id,
          image:
            d.image && !String(d.image).startsWith('http')
              ? `${this.mediaUrl}${d.image}`
              : d.image,
          status:
            d.status === true || d.status === 1 || d.status === '1' ? 1 : 0,
        });
        if (d?.localeComplete && typeof d.localeComplete === 'object') {
          this.languageStatuses.set('en', {
            code: 'en',
            status: d.localeComplete.en ? 'completed' : 'not-started',
          });
          this.languageStatuses.set('ar', {
            code: 'ar',
            status: d.localeComplete.ar ? 'completed' : 'not-started',
          });
          this.updateSettingsComponent();
        } else {
          this.syncLanguageStatusFromTitles();
        }
        this.form.markAsPristine();
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Same rules as project/service forms: title filled → completed;
   * active UI language with no title yet → ongoing (create or edit);
   * other language empty → not-started.
   */
  private syncLanguageStatusFromTitles(): void {
    const en = !!this.form.get('title_en')?.value?.trim();
    const ar = !!this.form.get('title_ar')?.value?.trim();
    const current = this.currentLanguage();

    const statusFor = (
      lang: 'en' | 'ar',
      hasTitle: boolean,
    ): LanguageStatusType => {
      if (hasTitle) return 'completed';
      if (lang === current) return 'ongoing';
      return 'not-started';
    };

    this.languageStatuses.set('en', {
      code: 'en',
      status: statusFor('en', en),
    });
    this.languageStatuses.set('ar', {
      code: 'ar',
      status: statusFor('ar', ar),
    });
    this.updateSettingsComponent();
  }

  addSection(): void {
    this.sections.push(this.createSectionGroup());
    this.applySectionEnabledState(this.sections.length - 1);
  }

  removeSection(index: number): void {
    if (this.sections.length <= 1) return;
    this.sections.removeAt(index);
  }

  onSectionToggle(index: number, event?: { checked?: boolean }): void {
    const g = this.sections.at(index) as FormGroup;
    if (event && event.checked !== undefined) {
      g.get('enabled')?.setValue(!!event.checked, { emitEvent: false });
    }
    this.applySectionEnabledState(index);
    g.updateValueAndValidity();
  }

  addSectionTag(): void {
    const val = this.sectionTagInput.trim();
    if (!val) return;
    this.sectionTags.push(this.fb.control(val));
    this.sectionTagInput = '';
  }

  removeSectionTag(index: number): void {
    this.sectionTags.removeAt(index);
  }

  hasError(
    controlName: string,
    errorCode?: string,
    sectionIndex?: number,
  ): boolean {
    if (sectionIndex !== undefined) {
      const g = this.sections.at(sectionIndex) as FormGroup;
      const c = g.get(controlName);
      if (!c) return false;
      if (errorCode) {
        return !!(c.touched && c.hasError(errorCode));
      }
      return !!(c.touched && c.invalid);
    }
    const c = this.form.get(controlName);
    if (!c) return false;
    if (errorCode) {
      return !!(c.touched && c.hasError(errorCode));
    }
    return !!(c.touched && c.invalid);
  }

  sectionGroupError(index: number, key: string): boolean {
    const g = this.sections.at(index) as FormGroup;
    return !!(g.touched && g.hasError(key));
  }

  onDiscard(): void {
    this.router.navigate(['/blogs/posts']);
  }

  activeTitleEmptyAndTouched(): boolean {
    const c = this.form.get(this.currentTitleControlName);
    return !!(c?.touched && !String(c?.value || '').trim());
  }

  onSave(): void {
    this.isFirstTimeToSend = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.sections.controls.forEach((c) => c.markAllAsTouched());
      return;
    }
    this.submitForm(this.currentLanguage(), true);
  }

  private submitForm(lang: string, navigateAway: boolean): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.sections.controls.forEach((c) => c.markAllAsTouched());
      return;
    }
    const v = this.form.getRawValue();
    const normalizedTags = (this.sectionTags.value as string[])
      .map((x) => String(x || '').trim())
      .filter(Boolean)
      .join(', ');
    const payload: BlogPostFormPayload = {
      title_en: v.title_en,
      title_ar: v.title_ar,
      category_id: String(v.category_id),
      image: v.image,
      status: Number(v.status) === 1 ? 1 : 0,
      sections: (v.sections as any[]).map((s, i) => {
        const sectionImageCtrl = (this.sections.at(i) as FormGroup).get('image');
        const shouldSendSectionImage =
          !this.isEditMode ||
          (!!sectionImageCtrl?.dirty && s.image instanceof File);
        return {
          id: s.id || undefined,
          enabled: !!s.enabled,
          title: s.title || '',
          subtitle_html: s.subtitle || '',
          image: shouldSendSectionImage ? s.image : null,
          quote: s.quote || '',
          tags: normalizedTags,
        };
      }),
    };
    const obs = this.isEditMode
      ? this.service.updatePost(this.postId, payload, lang)
      : this.service.createPost(payload, lang);
    obs.subscribe({
      next: (res: any) => {
        if (!this.isEditMode && res?.result?.id) {
          this.postId = res.result.id;
          this.isEditMode = true;
        }
        this.syncLanguageStatusFromTitles();
        this.form.markAsPristine();
        if (navigateAway) {
          this.router.navigate(['/blogs/posts']);
        } else {
          const currentStatus = this.languageStatuses.get(lang)?.status;
          if (currentStatus !== 'completed') {
            this.languageStatuses.set(lang, { code: lang, status: 'completed' });
          }
          this.updateSettingsComponent();
        }
      },
      error: () => {
        this.formActionsComponent?.revertLanguage();
      },
    });
  }

  onLanguageChange(event: { newLang: string; oldLang: string }): void {
    this.previousLanguage = event.oldLang;

    if (this.isEditMode && this.form.valid) {
      if (this.form.dirty) {
        this.showLanguageChangeConfirmation(event);
      } else {
        this.switchLanguage(event.newLang);
      }
      return;
    }

    if (this.form.invalid) {
      setTimeout(() => {
        this.formActionsComponent?.revertLanguage();
        this.form.markAllAsTouched();
        this.sections.controls.forEach((c) => c.markAllAsTouched());
      }, 0);
      return;
    }

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
    this.confirmDialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '40vw',
      modal: true,
      data: {
        title: 'general.change_lang_dialog_header',
        subtitle: 'general.change_lang_dialog_desc',
        confirmText: 'general.change_lang_dialog_save',
        cancelText: 'general.cancel',
        confirmSeverity: 'success',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: { lang: event.oldLang, newLang: event.newLang },
      },
    });

    this.confirmDialogRef.onClose.subscribe(
      (result: { action: string; data: { lang: string; newLang: string } }) => {
        if (!result) {
          this.formActionsComponent?.revertLanguage();
          return;
        }
        if (result.action === 'confirm') {
          this.saveAndSwitchLanguage(result.data.lang, result.data.newLang);
        } else {
          this.switchLanguage(event.newLang);
        }
      },
    );
  }

  private saveAndSwitchLanguage(currentLang: string, newLang: string): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.sections.controls.forEach((c) => c.markAllAsTouched());
      this.formActionsComponent?.revertLanguage();
      return;
    }
    const v = this.form.getRawValue();
    const normalizedTags = (this.sectionTags.value as string[])
      .map((x) => String(x || '').trim())
      .filter(Boolean)
      .join(', ');
    const payload: BlogPostFormPayload = {
      title_en: v.title_en,
      title_ar: v.title_ar,
      category_id: String(v.category_id),
      image: v.image,
      status: Number(v.status) === 1 ? 1 : 0,
      sections: (v.sections as any[]).map((s, i) => {
        const sectionImageCtrl = (this.sections.at(i) as FormGroup).get('image');
        const shouldSendSectionImage =
          !this.isEditMode ||
          (!!sectionImageCtrl?.dirty && s.image instanceof File);
        return {
          id: s.id || undefined,
          enabled: !!s.enabled,
          title: s.title || '',
          subtitle_html: s.subtitle || '',
          image: shouldSendSectionImage ? s.image : null,
          quote: s.quote || '',
          tags: normalizedTags,
        };
      }),
    };
    const obs = this.isEditMode
      ? this.service.updatePost(this.postId, payload, currentLang)
      : this.service.createPost(payload, currentLang);
    obs.subscribe({
      next: (res: any) => {
        if (!this.isEditMode && res?.result?.id) {
          this.postId = res.result.id;
          this.isEditMode = true;
        }
        this.languageStatuses.set(currentLang, {
          code: currentLang,
          status: 'completed',
        });
        this.updateSettingsComponent();
        this.form.markAsPristine();
        this.switchLanguage(newLang);
      },
      error: () => this.formActionsComponent?.revertLanguage(),
    });
  }

  private switchLanguage(lang: string): void {
    this.currentLanguage.set(lang);
    this.updateActiveTitleValidators(lang);
    this.commitLanguage(lang);
    this.loadCategories(lang);
    this.isFirstTimeToSend = true;
    this.syncLanguageStatusFromTitles();
    if (this.isEditMode && this.postId) {
      this.loadPost(this.postId, lang);
    }
  }

  private resetLanguage(lang: string): void {
    this.formActionsComponent?.revertLanguage();
    this.currentLanguage.set(lang);
    this.updateActiveTitleValidators(lang);
  }

  private commitLanguage(lang: string): void {
    this.formActionsComponent?.confirmLanguage(lang);
  }

  private updateSettingsComponent(): void {
    if (!this.settingsComponent) return;
    const getStatus = (lang: string) =>
      STATUS_MAP[this.languageStatuses.get(lang)?.status || 'not-started'];
    this.settingsComponent.englishStatus = getStatus('en');
    this.settingsComponent.arabicStatus = getStatus('ar');
    this.cdr.detectChanges();
  }

  private extractTagTokens(value: any): string[] {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map((item: any) => {
          if (typeof item === 'string') return item.trim();
          if (item && typeof item === 'object') {
            return String(item.name ?? item.label ?? item.value ?? '').trim();
          }
          return String(item ?? '').trim();
        })
        .filter(Boolean);
    }

    const raw = String(value).trim();
    if (!raw) return [];

    if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return this.extractTagTokens(parsed);
        }
      } catch {
        // Fallback to delimiter-based parsing below.
      }
    }

    return raw
      .split(/[,\u060C]/)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  private hydrateSectionTags(sections: BlogPostSection[] = [], rootTags?: any): void {
    const fromSections = sections.flatMap((s: any) =>
      this.extractTagTokens(s?.tags ?? s?.section_tags ?? s?.sectionTags),
    );
    const fromRoot = this.extractTagTokens(rootTags);
    const unique = Array.from(new Set([...fromSections, ...fromRoot]));
    unique.forEach((tag) => this.sectionTags.push(this.fb.control(tag)));
  }

  private applySectionEnabledState(index: number): void {
    const g = this.sections.at(index) as FormGroup;
    // Keep section fields enabled to avoid CVA/UI stale rendering on initial load.
    // The section visibility/behavior is driven by `enabled` in template + validator.
    ['title', 'subtitle', 'image', 'quote'].forEach((name) => {
      g.get(name)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private resolveLocalizedTitles(d: any): { title_en: string; title_ar: string } {
    const titleEn = String(d?.title_en || '').trim();
    const titleAr = String(d?.title_ar || '').trim();
    const singleName = String(d?.title || d?.name || '').trim();
    if (titleEn || titleAr || !singleName) {
      return { title_en: titleEn, title_ar: titleAr };
    }

    return { title_en: singleName, title_ar: '' };
  }

  private updateActiveTitleValidators(_lang: string): void {
    const en = this.form.get('title_en');
    const ar = this.form.get('title_ar');
    if (!en || !ar) return;
    en.setValidators([Validators.required, Validators.maxLength(300)]);
    ar.setValidators([Validators.maxLength(300)]);
    en.updateValueAndValidity({ emitEvent: false });
    ar.updateValueAndValidity({ emitEvent: false });
  }
}
