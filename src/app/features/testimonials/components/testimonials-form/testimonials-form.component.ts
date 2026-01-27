import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TestimonialsService } from '../../services/testimonials.service';

@Component({
  selector: 'app-testimonials-form',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule],
  templateUrl: './testimonials-form.component.html',
  styleUrl: './testimonials-form.component.scss'
})
export class TestimonialsFormComponent implements OnInit {
  @Input() testimonialId?: string;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

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

  ngOnChanges() {
    // Reset form when testimonialId changes or becomes undefined
    if (!this.testimonialId && this.form) {
      this.isEditMode = false;
      this.form.reset();
    } else if (this.testimonialId && this.form) {
      this.isEditMode = true;
      this.loadTestimonial();
    }
  }

  initForm() {
    this.form = this.fb.group({
      clientNameEn: ['', Validators.required],
      clientNameAr: ['', Validators.required],
      jobTitleEn: ['', Validators.required],
      jobTitleAr: ['', Validators.required],
      testimonialEn: ['', Validators.required],
      testimonialAr: ['', Validators.required]
    });
  }

  loadTestimonial() {
    if (!this.testimonialId) return;
    
    this.isLoading = true;
    this.testimonialsService.getById(this.testimonialId).subscribe({
      next: (res) => {
        console.log('Loaded testimonial data:', res);
        const data = res.result;
        this.form.patchValue({
          clientNameEn: data.client_name_en,
          clientNameAr: data.client_name_ar,
          jobTitleEn: data.job_title_en,
          jobTitleAr: data.job_title_ar,
          testimonialEn: data.testimonial_en,
          testimonialAr: data.testimonial_ar
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load testimonial error:', err);
        alert('Failed to load testimonial data');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    console.log('Form submitted');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    
    if (this.form.valid) {
      this.save.emit(this.form.value);
      
      // Reset form only if not in edit mode
      if (!this.isEditMode) {
        this.form.reset();
      }
    } else {
      this.markFormGroupTouched(this.form);
      console.log('Form errors:', this.getFormValidationErrors());
    }
  }

  onSaveAndCreateNew() {
    console.log('Save and create new clicked');
    
    if (this.form.valid) {
      this.save.emit({ ...this.form.value, createNew: true });
      
      // Reset form for new entry
      this.form.reset();
    } else {
      this.markFormGroupTouched(this.form);
      console.log('Form errors:', this.getFormValidationErrors());
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}