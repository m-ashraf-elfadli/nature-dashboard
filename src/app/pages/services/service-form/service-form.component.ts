import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { EmptyStateActionComponent } from '../../../shared/components/empty-state-action/empty-state-action.component';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';
import {
  MiniTableColumn,
  MiniTableComponent,
} from '../../../shared/components/mini-table/mini-table.component';

import { StageFormComponent } from '../../../shared/components/stage-form/stage-form.component';
import { AppDialogService } from '../../../shared/services/dialog.service';

export interface ServiceItemFormValue {
  title: string;
  description: string;
  image: File | null;
  imagePreview?: string | null;
}

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PageHeaderComponent,
    FormActionsComponent,
    EmptyStateActionComponent,
    SettingsComponent,
    MiniTableComponent,
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss',
  providers: [AppDialogService],
})
export class ServiceFormComponent implements OnInit {
  pageTitle = 'Add New Service';
  serviceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogService: AppDialogService
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required],
      serviceTagline: ['', Validators.required],
      status: [1],

      stages: this.fb.array([]),
      serviceValues: this.fb.array([]),
      serviceResults: this.fb.array([]),
    });
  }

  /* ---------------- TABLE CONFIG ---------------- */

  cols: MiniTableColumn[] = [
    { field: 'title', header: 'Title' },
    { field: 'description', header: 'Description' },
    { field: 'action', header: 'Action', type: 'action' },
  ];

  /* ---------------- FORM ARRAYS ---------------- */

  get stagesArray(): FormArray {
    return this.serviceForm.get('stages') as FormArray;
  }

  get serviceValuesArray(): FormArray {
    return this.serviceForm.get('serviceValues') as FormArray;
  }

  get serviceResultsArray(): FormArray {
    return this.serviceForm.get('serviceResults') as FormArray;
  }

  get stages(): ServiceItemFormValue[] {
    return this.stagesArray.value;
  }

  /* ---------------- FACTORY ---------------- */

  private createItemGroup(item: ServiceItemFormValue): FormGroup {
    return this.fb.group({
      title: [item.title, Validators.required],
      description: [item.description, Validators.required],
      image: [item.image],
      imagePreview: [item.imagePreview],
    });
  }

  /* ---------------- DIALOG ---------------- */

  openStagePopup(): void {
    this.openItemPopup(this.stagesArray, 'Create New Stage');
  }

  private openItemPopup(targetArray: FormArray, header: string): void {
    const ref = this.dialogService.open(StageFormComponent, {
      header,
      width: '600px',
    });

    ref.onClose.subscribe((data: ServiceItemFormValue | null) => {
      if (!data) return;

      targetArray.push(
        this.createItemGroup({
          ...data,
          imagePreview: data.image ? URL.createObjectURL(data.image) : null,
        })
      );
    });
  }

  /* ---------------- TABLE ACTIONS ---------------- */

  onDeleteStage(index: number): void {
    this.removeFromArray(this.stagesArray, index);
  }

  onReorder(data: ServiceItemFormValue[]): void {
    this.stagesArray.clear();
    data.forEach((item) => this.stagesArray.push(this.createItemGroup(item)));
  }

  private removeFromArray(array: FormArray, index: number): void {
    const item = array.at(index)?.value;
    if (item?.imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(item.imagePreview);
    }
    array.removeAt(index);
  }

  /* ---------------- FORM ACTIONS ---------------- */

  onDiscard(): void {
    console.log('discard');
  }

  onSave(): void {
    this.submitForm();
  }

  submitForm(): void {
    console.log(this.serviceForm.value);
  }

  onLanguageChange(event: any): void {}
}
