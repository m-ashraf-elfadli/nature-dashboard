import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { EditorModule } from 'primeng/editor';
import { GalleryUploadComponent } from '../../../../shared/components/gallery-upload/gallery-upload.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { MessageModule } from 'primeng/message';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AwardsService } from '../../../../services/awards.service';
import { environment } from '../../../../../environments/environment';
import { Award } from '../../models/awards.interface';

@Component({
  selector: 'app-award-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    FormActionsComponent,
    TranslateModule,
    InputTextModule,
    DatePickerModule,
    EditorModule,
    GalleryUploadComponent,
    SettingsComponent,
    MessageModule,
  ],
  templateUrl: './award-form.component.html',
  styleUrl: './award-form.component.scss',
})
export class AwardFormComponent implements OnInit {
  @ViewChild(FormActionsComponent) formActionsComponent!: FormActionsComponent;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(AwardsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  form!: FormGroup;
  awardId: string = '';
  isEditMode: boolean = false;
  awardData: Award = {} as Award;
  mediaUrl: string = environment.mediaUrl;
  ref: DynamicDialogRef | undefined;

  currentLanguage = localStorage.getItem('app_lang') || 'en';


  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.awardId = params['id'];
        this.getAwardById(this.awardId, this.currentLanguage);
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
      award_date: [null, Validators.required],
      organizations_logos: [null],
      status: [1, Validators.required],
    });
  }

  getAwardById(id: string, culture: string) {
    this.service.getById(id, culture).subscribe({
      next: (res) => {
        this.awardData = res.result
        this.patchValues(this.awardData);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  patchValues(data: Award) {
    if (!data) return;
    this.awardData = data;
    this.isEditMode = true;
    const parseDate = (d?: string | null): Date | null => {
      if (!d) return null;
      const parts = d.split('/');
      if (parts.length === 3) {
        return new Date(+parts[2], +parts[1] - 1, +parts[0]);
      }
      return new Date(d);
    };

    this.form.patchValue({
      name: data.name || '',
      description: data.description || '',
      award_date: parseDate(data.awardDate),
      status: data.status ? 1 : 0,
    });

    // Images
    if (data.image) {
      this.form.get('image')?.setValue(this.mediaUrl + data.image);
    }
    if (data.organizationLogos && data.organizationLogos.length) {
      const logos = data.organizationLogos.map((logo: any) => this.mediaUrl + logo.url);
      this.form.get('organizations_logos')?.setValue(logos);
    }
  }

  onDiscard(event: Event) {
    console.log(event);
  }

  onSave() {
    this.submitForm(true, this.currentLanguage);
  }

  submitForm(isNavigateOut: boolean = false, culture?: string) {
    const formData = this.buildFormData();
    const request = this.isEditMode
      ? this.service.update(this.awardId, formData, culture)
      : this.service.create(formData, culture);
    request.subscribe({
      next: (res) => {
        if (!this.isEditMode) {
          this.awardId = res.result.id;
          this.isEditMode = true;
        }
        if (isNavigateOut) {
          this.router.navigate(['/awards']);
        } else {
          const projectCluture:'en' | 'ar' =culture === 'en' ? 'ar' :'en'
          this.form.markAsPristine()
          this.getAwardById(this.awardId, projectCluture!);
        }
      },
      error: (err) => {
        console.error(err);
        setTimeout(() => {
          this.formActionsComponent.revertLanguage()
        }, 0);
      },
    });
  }

  buildFormData(): FormData {
    const formData = new FormData();
    const value = this.form.value;

    if (this.isEditMode) {
      formData.append('id', this.awardId);
    }
    formData.append('name', value.name);
    formData.append('description', value.description);
    formData.append('award_date', this.formatDate(value.award_date));
    formData.append('status', value.status);

    // Single image
    if (value.image instanceof File) {
      formData.append('image', value.image);
    }

    // Organizations logos (array of images)
    if (value.organizations_logos?.length) {
      value.organizations_logos.forEach((file: File, index: number) => {
        if (file instanceof File) {
          formData.append(`organizations_logos[${index}]`, file);
        }
      });
    }

    return formData;
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }

  hasError(controlName: string, errorName?: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;
    if (errorName) {
      return !!(control.touched && control.hasError(errorName));
    }
    return !!(control.touched && control.invalid);
  }

  onLanguageChange(event: { newLang: string; oldLang: string }) {
    if (this.form.invalid) {
      setTimeout(() => {
        this.formActionsComponent.revertLanguage()
        this.form.markAllAsTouched();
      }, 0);
    } else {
      this.formActionsComponent.confirmLanguage(event.newLang)
      if(this.form.dirty){
        this.currentLanguage = event.newLang
        this.showConfirmDialog(event.oldLang);
      }else{
        this.submitForm(false,event.oldLang)
      }
    }
  }

  showConfirmDialog(lang: string) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Select a Product',
      width: '40vw',
      modal: true,
      data: {
        title: 'projects.form.language_dialog.header',
        subtitle: 'projects.form.language_dialog.desc',
        confirmText: 'projects.form.btns.save',
        cancelText: 'general.cancel',
        confirmSeverity: 'success',
        cancelSeverity: 'cancel',
        showCancel: true,
        showExtraButton: false,
        data: { lang },
      },
    });
    this.ref.onClose.subscribe(
      (product: { action: string; data: { lang: string } }) => {
        if (product) {
          if (product.action === 'confirm') {
            this.submitForm(false, product.data.lang);
          }
        }
      },
    );
  }
}
