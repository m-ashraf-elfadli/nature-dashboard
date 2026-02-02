import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { ClientsService } from '../../services/clients.service';
import { ClientFormActions, ClientFormEvent } from '../../models/clients.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [InputTextModule, GalleryUploadComponent, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit, OnChanges {
  @Input() clientId?: string;
  @Output() close = new EventEmitter<ClientFormEvent>();

  private fb = inject(FormBuilder);
  private clientsService = inject(ClientsService);

  form!: FormGroup;
  isEditMode = false;
  isLoading = false;

  ngOnInit() {
    this.initForm();
    this.loadClient();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clientId']) {

      // EDIT MODE
      if (this.clientId) {
        this.isEditMode = true;
      }

      // CREATE MODE
      else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  private initForm() {
    this.form = this.fb.group({
      clientNameEn: ['', Validators.required],
      clientNameAr: ['', Validators.required],
      clientImage: [null, Validators.required]
    });
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private loadClient() {
    if (!this.clientId) return;

    this.isLoading = true;

    this.clientsService.getById(this.clientId).subscribe({
      next: (res) => {
        const data = res.result;

        this.form.patchValue({
          clientNameEn: data.name_en || data.name,
          clientNameAr: data.name_ar || data.name,
          clientImage: data.image
            ? `${environment.mediaUrl}${data.image}`
            : null
        });

        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load client data');
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

  private emitAction(action: ClientFormActions) {
    const formData = this.prepareFormData();
    this.close.emit({ action, formData });
  }

  private prepareFormData(): FormData {
    const formData = new FormData();

    formData.append('name_en', this.form.value.clientNameEn);
    formData.append('name_ar', this.form.value.clientNameAr);

    const imageValue = this.form.value.clientImage;
    if (imageValue instanceof File) {
      formData.append('image', imageValue);
    }

    return formData;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
