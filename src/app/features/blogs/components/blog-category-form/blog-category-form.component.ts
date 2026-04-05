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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
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
import { BLOG_CATEGORY_TYPES } from '../../data/blog-dummy.data';

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
      name_en: ['', [Validators.required, Validators.maxLength(200)]],
      name_ar: ['', [Validators.required, Validators.maxLength(200)]],
      type_id: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  private load(): void {
    if (!this.categoryId) return;
    this.service.getCategoryById(this.categoryId).subscribe({
      next: (res: any) => {
        const d = res?.result;
        if (!d) return;
        this.form.patchValue({
          name_en: d.name_en,
          name_ar: d.name_ar,
          type_id: d.type_id,
          image: d.image,
        });
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
      name_en: v.name_en,
      name_ar: v.name_ar,
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
