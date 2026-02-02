import { Component, EventEmitter, Input, OnInit, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TestimonialsService } from '../../services/testimonials.service';
import { TestimonialFormAction, TestimonialFormEvent } from '../../models/testimonials.model';

@Component({
  selector: 'app-testimonials-form',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule],
  templateUrl: './testimonials-form.component.html',
  styleUrl: './testimonials-form.component.scss'
})
export class TestimonialsFormComponent implements OnInit, OnChanges {
  @Input() testimonialId?: string;
  @Output() close = new EventEmitter<TestimonialFormEvent>();

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


      // EDIT MODE
      if (currentValue) {
        this.isEditMode = true;
        this.loadTestimonial();
      }
      // CREATE MODE
      else if (this.form) {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  private initForm() {
    this.form = this.fb.group({
      clientNameEn: ['', Validators.required],
      clientNameAr: ['', Validators.required],
      jobTitleEn: ['', Validators.required],
      jobTitleAr: ['', Validators.required],
      testimonialEn: ['', Validators.required],
      testimonialAr: ['', Validators.required]
    });
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
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
        alert('Failed to load testimonial data');
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
}
