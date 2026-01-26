import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-testimonials-form',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule],
  templateUrl: './testimonials-form.component.html',
  styleUrl: './testimonials-form.component.scss'
})
export class TestimonialsFormComponent {

  @Output() save = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      clientName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      testimonial: ['', Validators.required],
      status: true
    });
  }

  submit() {
    if (this.form.valid) {
      this.save.emit({
        clientName: this.form.value.clientName,
        jobTitle: this.form.value.jobTitle,
        Testimonial: this.form.value.testimonial,
        status: this.form.value.status ? 1 : 0
      });
    }
  }
}
