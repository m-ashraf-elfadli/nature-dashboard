import { Component, EventEmitter, Input, OnInit, Output, inject, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TestimonialsService } from '../../services/testimonials.service';
import { TestimonialFormAction, TestimonialFormEvent } from '../../models/testimonials.model';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-testimonials-form',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './testimonials-form.component.html',
  styleUrl: './testimonials-form.component.scss'
})
export class TestimonialsFormComponent implements OnInit, OnChanges {
  @Input() testimonialId?: string;
  @Output() close = new EventEmitter<TestimonialFormEvent>();
  @ViewChild('formContainer') formContainer?: ElementRef<HTMLElement>;

  private fb = inject(FormBuilder);
  private testimonialsService = inject(TestimonialsService);

  form!: FormGroup;
  isEditMode = false;
  isLoading = false;

  ngOnInit() {
    this.initForm();

    if (this.testimonialId) {
      this.isEditMode = true;
      this.loadTestimonial();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['testimonialId']) {
      const currentValue = changes['testimonialId'].currentValue
      if (currentValue) {
        this.isEditMode = true;
        this.loadTestimonial();
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  private initForm() {
    this.form = this.fb.group({
      clientNameEn: ['', [Validators.required, Validators.maxLength(60)]],
      clientNameAr: ['', [Validators.required, Validators.maxLength(60)]],
      jobTitleEn: ['', [Validators.required, Validators.maxLength(60)]],
      jobTitleAr: ['', [Validators.required, Validators.maxLength(60)]],
      testimonialEn: ['', [Validators.required, Validators.maxLength(1000)]],
      testimonialAr: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  resetForm() {
    this.form?.reset();
    this.form?.markAsPristine();
    this.form?.markAsUntouched();
  }

  scrollToTop() {
    this.formContainer?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private loadTestimonial() {
    if (!this.testimonialId) {
      return;
    }

    this.isLoading = true;

    this.testimonialsService.getById(this.testimonialId).subscribe({
      next: (res) => {

        const data = res.result;
        this.form.patchValue({
          clientNameEn: data.client_name_en || data.clientName || '',
          clientNameAr: data.client_name_ar || '',
          jobTitleEn: data.job_title_en || data.jobTitle || '',
          jobTitleAr: data.job_title_ar || '',
          testimonialEn: data.testimonial_en || data.Testimonial || data.testimonial || '',
          testimonialAr: data.testimonial_ar || ''
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load testimonial error:', err);
        console.error('Error details:', err.error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.emitAction('save');
    } else {
      this.form.markAllAsTouched();
    }
  }

  onSaveAndCreateNew() {
    if (this.form.valid) {
      this.emitAction('saveAndCreateNew');
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.emitAction('cancel');
  }

  private emitAction(action: TestimonialFormAction) {
    const formData = this.prepareFormData();
    this.close.emit({ action, formData });
  }

  private prepareFormData(): any {
    return {
      clientNameEn: this.form.value.clientNameEn,
      clientNameAr: this.form.value.clientNameAr,
      jobTitleEn: this.form.value.jobTitleEn,
      jobTitleAr: this.form.value.jobTitleAr,
      testimonialEn: this.form.value.testimonialEn,
      testimonialAr: this.form.value.testimonialAr
    };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasError(fieldName: string, errorKey: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.touched && field.hasError(errorKey));
  }
}
