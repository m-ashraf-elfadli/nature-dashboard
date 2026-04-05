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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { TrimInputDirective } from '../../../../core/directives/trim-input.directive';
import { BlogsService } from '../../services/blogs.service';
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
    TranslateModule,
    InputText,
    SelectModule,
    MessageModule,
    EditorModule,
    ToggleSwitchModule,
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
  private readonly cdr = inject(ChangeDetectorRef);
  private categoriesSub?: Subscription;
  private titleStatusSub?: Subscription;

  form!: FormGroup;
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
    this.loadCategories();
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
        this.loadPost(id);
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

  private loadCategories(): void {
    this.categoriesSub?.unsubscribe();
    this.categoriesSub = this.service.getCategoriesForDropdown().subscribe({
      next: (opts) => (this.categoryOptions = opts),
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      title_en: ['', [Validators.required, Validators.maxLength(300)]],
      title_ar: ['', [Validators.required, Validators.maxLength(300)]],
      category_id: [null, Validators.required],
      image: [null, Validators.required],
      status: [1, Validators.required],
      sections: this.fb.array([this.createSectionGroup()]),
    });
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
    return this.fb.group(
      {
        enabled: [data?.enabled ?? true],
        title: [data?.title ?? ''],
        subtitle: [data?.subtitle_html ?? ''],
        image: [data?.image ?? null],
        quote: [data?.quote ?? ''],
        tags: [data?.tags ?? ''],
      },
      { validators: this.sectionGroupValidator },
    );
  }

  private resetFormForCreate(): void {
    this.sections.clear();
    this.sections.push(this.createSectionGroup());
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

  private loadPost(id: string): void {
    this.service.getPostById(id).subscribe({
      next: (res: any) => {
        const d = res?.result;
        if (!d) return;
        this.sections.clear();
        if (d.sections?.length) {
          d.sections.forEach((s: BlogPostSection) =>
            this.sections.push(this.createSectionGroup(s)),
          );
        } else {
          this.sections.push(this.createSectionGroup());
        }
        this.form.patchValue({
          title_en: d.title_en,
          title_ar: d.title_ar,
          category_id: d.category_id,
          image: d.image,
          status:
            d.status === true || d.status === 1 || d.status === '1' ? 1 : 0,
        });
        this.syncLanguageStatusFromTitles();
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
  }

  removeSection(index: number): void {
    if (this.sections.length <= 1) return;
    this.sections.removeAt(index);
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

  onSave(): void {
    this.isFirstTimeToSend = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.sections.controls.forEach((c) => c.markAllAsTouched());
      return;
    }
    const v = this.form.getRawValue();
    const payload: BlogPostFormPayload = {
      title_en: v.title_en,
      title_ar: v.title_ar,
      category_id: String(v.category_id),
      image: v.image,
      status: Number(v.status) === 1 ? 1 : 0,
      sections: (v.sections as any[]).map((s) => ({
        enabled: !!s.enabled,
        title: s.title || '',
        subtitle_html: s.subtitle || '',
        image: s.image,
        quote: s.quote || '',
        tags: s.tags || '',
      })),
    };
    const obs = this.isEditMode
      ? this.service.updatePost(this.postId, payload)
      : this.service.createPost(payload);
    obs.subscribe({
      next: (res: any) => {
        if (!this.isEditMode && res?.result?.id) {
          this.postId = res.result.id;
          this.isEditMode = true;
        }
        this.syncLanguageStatusFromTitles();
        this.form.markAsPristine();
        this.router.navigate(['/blogs/posts']);
      },
      error: () => {
        this.formActionsComponent?.revertLanguage();
      },
    });
  }

  onLanguageChange(event: { newLang: string; oldLang: string }): void {
    this.previousLanguage = event.oldLang;
    this.currentLanguage.set(event.newLang);
    this.formActionsComponent?.confirmLanguage(event.newLang);
    localStorage.setItem('app_lang', event.newLang);
    this.isFirstTimeToSend = true;
    this.syncLanguageStatusFromTitles();
  }

  private updateSettingsComponent(): void {
    if (!this.settingsComponent) return;
    const getStatus = (lang: string) =>
      STATUS_MAP[this.languageStatuses.get(lang)?.status || 'not-started'];
    this.settingsComponent.englishStatus = getStatus('en');
    this.settingsComponent.arabicStatus = getStatus('ar');
    this.cdr.detectChanges();
  }
}
