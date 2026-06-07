import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
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
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { TrimInputDirective } from '../../../../core/directives/trim-input.directive';
import { EnvironmentalCalendarService } from '../../services/environmental-calendar.service';
import {
  EnvironmentalEventFormEvent,
  EnvironmentalEventFormPayload,
} from '../../models/environmental-calendar.model';
import { EVENT_COLORS, EVENT_TYPES } from '../../data/event.constants';
import { environment } from '../../../../../environments/environment';

type EventFormField =
  | 'title_en'
  | 'title_ar'
  | 'event_type'
  | 'event_color'
  | 'event_date'
  | 'image';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputText,
    SelectModule,
    DatePickerModule,
    MessageModule,
    GalleryUploadComponent,
    TrimInputDirective,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() eventId?: string;
  @Output() formClose = new EventEmitter<EnvironmentalEventFormEvent>();
  @ViewChild('formContainer') formContainer!: ElementRef;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(EnvironmentalCalendarService);
  private readonly translate = inject(TranslateService);
  private langSub = this.translate.onLangChange.subscribe(() =>
    this.refreshOptions(),
  );

  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  typeOptions: { id: string; label: string }[] = [];
  colorOptions: { id: string; label: string }[] = [];

  ngOnInit(): void {
    if (!this.form) {
      this.initForm();
    }
    this.refreshOptions();
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.initForm();
    }
    if (changes['eventId']) {
      this.isEditMode = !!this.eventId;
      if (this.eventId) {
        this.load();
      } else {
        this.resetFormValues();
      }
    }
  }

  private refreshOptions(): void {
    this.typeOptions = EVENT_TYPES.map((t) => ({
      id: t.id,
      label: this.translate.instant(t.labelKey),
    }));
    this.colorOptions = EVENT_COLORS.map((c) => ({
      id: c.id,
      label: this.translate.instant(c.labelKey),
    }));
  }

  private initForm(): void {
    this.form = this.fb.group({
      title_en: ['', this.titleValidators()],
      title_ar: ['', this.titleValidators()],
      event_type: [null, Validators.required],
      event_color: [null, Validators.required],
      event_date: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  private titleValidators() {
    return [
      Validators.required,
      this.notBlankValidator,
      this.trimmedMinLengthValidator(3),
      this.trimmedMaxLengthValidator(50),
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
    if (!this.eventId) return;

    this.isLoading = true;

    this.service.getEventById(this.eventId).subscribe({
      next: (res: any) => {
        const data = res?.result;
        if (!data) {
          this.isLoading = false;
          return;
        }

        this.form.patchValue({
          title_en: data.title_en || data.title || '',
          title_ar: data.title_ar || data.title || '',
          event_type: data.event_type || null,
          event_color: data.event_color || null,
          event_date: data.event_date ? this.parseDate(data.event_date) : null,
          image: data.image
            ? data.image.startsWith('http://') || data.image.startsWith('https://')
              ? data.image
              : `${environment.mediaUrl}${data.image}`
            : null,
        });

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private parseDate(value: string): Date | null {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  private formatDate(value: any): string {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submit(action: 'save' | 'saveAndCreateNew'): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: EnvironmentalEventFormPayload = {
      title_en: String(v.title_en ?? '').trim(),
      title_ar: String(v.title_ar ?? '').trim(),
      event_type: v.event_type,
      event_color: v.event_color,
      event_date: this.formatDate(v.event_date),
      image: v.image,
    };
    this.formClose.emit({ action, formData: payload });
  }

  cancel(): void {
    this.formClose.emit({ action: 'cancel' });
  }

  resetForm(): void {
    this.resetFormValues();
    this.scrollToTop();
  }

  private resetFormValues(): void {
    this.form?.reset({
      title_en: '',
      title_ar: '',
      event_type: null,
      event_color: null,
      event_date: null,
      image: null,
    });
  }

  private scrollToTop(): void {
    if (this.formContainer) {
      setTimeout(() => {
        this.formContainer.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    }
  }

  getErrorMessage(fieldName: EventFormField): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    const e = control.errors;
    const base = 'environmental_calendar.form.validation';

    if (fieldName === 'title_en' || fieldName === 'title_ar') {
      if (e['required']) {
        return this.translate.instant(`${base}.${fieldName}_required`);
      }
      if (e['blank']) {
        return this.translate.instant(`${base}.${fieldName}_required`);
      }
      if (e['minlength']) {
        const p = e['minlength'] as { requiredLength: number; actualLength: number };
        return this.translate.instant(`${base}.${fieldName}_min`, {
          min: p.requiredLength,
          current: p.actualLength,
        });
      }
      if (e['maxlength']) {
        const p = e['maxlength'] as { requiredLength: number; actualLength: number };
        return this.translate.instant(`${base}.${fieldName}_max`, {
          max: p.requiredLength,
          current: p.actualLength,
        });
      }
    }

    if (fieldName === 'event_type' && e['required']) {
      return this.translate.instant(`${base}.event_type`);
    }
    if (fieldName === 'event_color' && e['required']) {
      return this.translate.instant(`${base}.event_color`);
    }
    if (fieldName === 'event_date' && e['required']) {
      return this.translate.instant(`${base}.event_date`);
    }
    if (fieldName === 'image' && e['required']) {
      return this.translate.instant(`${base}.image`);
    }

    return '';
  }
}
