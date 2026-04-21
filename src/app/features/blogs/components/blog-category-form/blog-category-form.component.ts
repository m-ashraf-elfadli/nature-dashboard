import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { TrimInputDirective } from '../../../../core/directives/trim-input.directive';
import { BlogsService } from '../../services/blogs.service';
import {
  BlogCategoryFormEvent,
  BlogCategoryFormPayload,
} from '../../models/blogs.model';
import { BLOG_CATEGORY_TYPES } from '../../data/blog.constants';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-blog-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputText,
    SelectModule,
    MessageModule,
    GalleryUploadComponent,
    TrimInputDirective,
  ],
  templateUrl: './blog-category-form.component.html',
  styleUrl: './blog-category-form.component.scss',
})
export class BlogCategoryFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() categoryId?: string;
  @Output() formClose = new EventEmitter<BlogCategoryFormEvent>();

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BlogsService);
  private readonly translate = inject(TranslateService);
  private langSub = this.translate.onLangChange.subscribe(() =>
    this.refreshTypeOptions(),
  );

  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  typeOptions: { id: string; label: string }[] = [];

  ngOnInit(): void {
    if (!this.form) {
      this.initForm();
    }
    this.refreshTypeOptions();
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  private refreshTypeOptions(): void {
    this.typeOptions = BLOG_CATEGORY_TYPES.map((t) => ({
      id: t.id,
      label: this.translate.instant(t.labelKey),
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.initForm();
    }
    if (changes['categoryId']) {
      this.isEditMode = !!this.categoryId;
      if (this.categoryId) {
        this.load();
      } else {
        this.form.reset({
          name_en: '',
          name_ar: '',
          type_id: null,
          image: null,
        });
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name_en: ['', this.nameValidators()],
      name_ar: ['', this.nameValidators()],
      type_id: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  private nameValidators() {
    return [
      Validators.required,
      this.notBlankValidator,
      this.trimmedMinLengthValidator(3),
      this.trimmedMaxLengthValidator(60),
    ];
  }

  private notBlankValidator(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '').trim();
    return value ? null : { blank: true };
  }

  private trimmedMinLengthValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '').trim();
      if (!value) return null;
      return value.length >= min
        ? null
        : { minlength: { requiredLength: min, actualLength: value.length } };
    };
  }

  private trimmedMaxLengthValidator(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '').trim();
      if (!value) return null;
      return value.length <= max
        ? null
        : { maxlength: { requiredLength: max, actualLength: value.length } };
    };
  }

  private load(): void {
    if (!this.categoryId) return;

    this.isLoading = true;

    this.service.getCategoryById(this.categoryId).subscribe({
      next: (res: any) => {
        const data = res?.result;
        if (!data) {
          this.isLoading = false;
          return;
        }

        this.form.patchValue({
          name_en: data.name_en || data.name || '',
          name_ar: data.name_ar || data.name || '',
          type_id: data.type_id,
          image: data.image
            ? data.image.startsWith('http://') ||
              data.image.startsWith('https://')
              ? data.image
              : `${environment.mediaUrl}${data.image}`
            : null,
        });

        this.isLoading = false;
      },
      error: () => {
        alert(this.translate.instant('blogs.categories.form.load_error'));
        this.isLoading = false;
      },
    });
  }

  submit(action: 'save' | 'saveAndCreateNew'): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: BlogCategoryFormPayload = {
      name_en: String(v.name_en ?? '').trim(),
      name_ar: String(v.name_ar ?? '').trim(),
      type_id: v.type_id,
      image: v.image,
    };
    this.formClose.emit({ action, formData: payload });
  }

  cancel(): void {
    this.formClose.emit({ action: 'cancel' });
  }

  resetForm(): void {
    this.form?.reset({
      name_en: '',
      name_ar: '',
      type_id: null,
      image: null,
    });
  }
}
