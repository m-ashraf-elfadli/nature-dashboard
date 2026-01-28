import { Component, EventEmitter, Input, OnInit, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { GalleryUploadComponent } from "../../../../shared/components/gallery-upload/gallery-upload.component";
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [InputTextModule, GalleryUploadComponent, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit, OnChanges {
  @Input() clientId?: string;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private clientsService = inject(ClientsService);

  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  uploadedImage: File | null = null;

  ngOnInit() {
    this.initForm();
    
    if (this.clientId) {
      this.isEditMode = true;
      this.loadClient();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // When clientId input changes
    if (changes['clientId']) {
      const currentValue = changes['clientId'].currentValue;
      
      // Switching to create mode (clientId is falsy)
      if (!currentValue && this.form) {
        console.log('Switching to Create Mode');
        this.isEditMode = false;
        this.uploadedImage = null;
        // Reset all form fields explicitly
        this.form.get('clientNameEn')?.setValue('');
        this.form.get('clientNameAr')?.setValue('');
        this.form.get('clientImage')?.setValue(null);
        this.form.markAsUntouched();
        this.form.markAsPristine();
      }
      // Switching to edit mode (clientId has a value)
      else if (currentValue && this.form) {
        console.log('Switching to Edit Mode:', currentValue);
        this.isEditMode = true;
        this.loadClient();
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      clientNameEn: ['', Validators.required],
      clientNameAr: ['', Validators.required],
      clientImage: [null]
    });
  }

  loadClient() {
    if (!this.clientId) return;
    
    this.isLoading = true;
    this.clientsService.getById(this.clientId).subscribe({
      next: (res) => {
        console.log('Loaded client data:', res);
        const data = res.result;
        
        // Build image URL if image exists
        let imageUrl = null;
        if (data.image) {
          imageUrl = 'https://lavenderblush-reindeer-325183.hostingersite.com/api/media/' + data.image;
        }
        
        this.form.patchValue({
          clientNameEn: data.name_en || data.name,
          clientNameAr: data.name_ar || data.name,
          clientImage: imageUrl
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load client error:', err);
        alert('Failed to load client data');
        this.isLoading = false;
      }
    });
  }

  // Fixed: Handle different types of events from gallery-upload
  onImageUpload(event: any) {
    console.log('Image upload event:', event);
    
    // Check if it's a File object
    if (event instanceof File) {
      this.uploadedImage = event;
      console.log('Single file uploaded:', event);
    }
    // Check if it's an array of files
    else if (Array.isArray(event) && event.length > 0) {
      this.uploadedImage = event[0]; // Take the first file
      console.log('Array of files, taking first:', event[0]);
    }
    // Check if it's an event object with a file property
    else if (event?.file) {
      this.uploadedImage = event.file;
      console.log('Event with file property:', event.file);
    }
    // Check if it's an event object with files array
    else if (event?.files && Array.isArray(event.files) && event.files.length > 0) {
      this.uploadedImage = event.files[0];
      console.log('Event with files array:', event.files[0]);
    }
    // Check if it's a FileList
    else if (event instanceof FileList && event.length > 0) {
      this.uploadedImage = event[0];
      console.log('FileList, taking first:', event[0]);
    }
    else {
      console.warn('Unknown event format:', event);
    }
  }

  onSubmit() {
    console.log('Form submitted');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    
    if (this.form.valid) {
      const formData = this.prepareFormData();
      this.save.emit(formData);
      
      if (!this.isEditMode) {
        this.form.reset();
        this.uploadedImage = null;
      }
    } else {
      this.markFormGroupTouched(this.form);
      console.log('Form errors:', this.getFormValidationErrors());
    }
  }

  onSaveAndCreateNew() {
    console.log('Save and create new clicked');
    
    if (this.form.valid) {
      const formData = this.prepareFormData();
      formData.append('createNew', 'true');
      this.save.emit(formData);
      
      this.form.reset();
      this.uploadedImage = null;
    } else {
      this.markFormGroupTouched(this.form);
      console.log('Form errors:', this.getFormValidationErrors());
    }
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    formData.append('name_en', this.form.value.clientNameEn);
    formData.append('name_ar', this.form.value.clientNameAr);
    
    if (this.uploadedImage) {
      formData.append('image', this.uploadedImage);
    }
    
    return formData;
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