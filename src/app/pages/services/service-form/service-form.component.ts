import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { EmptyStateActionComponent } from '../../../shared/components/empty-state-action/empty-state-action.component';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';
import {
  MiniTableColumn,
  MiniTableComponent,
} from '../../../shared/components/mini-table/mini-table.component';

import { StageFormComponent } from '../stage-form/stage-form.component';
import { ValueFormComponent } from '../value-form/value-form.component';
import { ResultsFormComponent } from '../results-form/results-form.component';
import { AppDialogService } from '../../../shared/services/dialog.service';

export interface ServiceItemFormValue {
  title: string;
  description: string;
  image?: File | null;
  imagePreview?: string | null;
  toolsUsed?: string[];
  [key: string]: any;
}

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputSwitchModule,
    PageHeaderComponent,
    FormActionsComponent,
    EmptyStateActionComponent,
    SettingsComponent,
    MiniTableComponent,
    FormsModule,
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

      // Benefits section
      benefitsEnabled: [true],
      benefitsTitle: [''],
      benefitsTagline: [''],
      benefitsBody: [''],
      benefitsInsights: this.fb.array([
        this.fb.group({ title: [''], number: [''] }),
      ]),
    });

    // Subscribe to benefitsEnabled changes to enable/disable benefits fields
    this.serviceForm
      .get('benefitsEnabled')
      ?.valueChanges.subscribe((enabled) => {
        this.toggleBenefitsFields(enabled);
      });
  }

  private toggleBenefitsFields(enabled: boolean): void {
    const benefitsFields = ['benefitsTitle', 'benefitsTagline', 'benefitsBody'];
    benefitsFields.forEach((field) => {
      const control = this.serviceForm.get(field);
      if (enabled) {
        control?.enable();
        control?.setValidators(Validators.required);
      } else {
        control?.disable();
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });

    // Handle benefitsInsights array - disable/enable all controls
    this.benefitsInsightsArray.controls.forEach((group) => {
      if (enabled) {
        group.enable();
      } else {
        group.disable();
      }
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

  get benefitsInsightsArray(): FormArray {
    return this.serviceForm.get('benefitsInsights') as FormArray;
  }

  get benefitsEnabledControl(): FormControl {
    return this.serviceForm.get('benefitsEnabled') as FormControl;
  }

  get stages(): ServiceItemFormValue[] {
    return this.stagesArray.value;
  }

  get serviceValues(): ServiceItemFormValue[] {
    return this.serviceValuesArray.value;
  }

  get serviceResults(): ServiceItemFormValue[] {
    return this.serviceResultsArray.value;
  }

  get benefitsInsights(): ServiceItemFormValue[] {
    return this.benefitsInsightsArray.value;
  }

  getInsightControl(index: number, field: string) {
    return this.benefitsInsightsArray.at(index)?.get(field);
  }

  /* ---------------- FACTORY ---------------- */

  private createItemGroup(item: ServiceItemFormValue): FormGroup {
    const groupConfig: any = {
      title: [item.title, Validators.required],
      description: [item.description, Validators.required],
    };

    // Dynamically add properties based on the item structure
    if (item.hasOwnProperty('image')) {
      groupConfig.image = [item.image];
    }

    if (item.hasOwnProperty('imagePreview')) {
      groupConfig.imagePreview = [item.imagePreview];
    }

    if (item.hasOwnProperty('toolsUsed')) {
      groupConfig.toolsUsed = [item.toolsUsed || []];
    }

    // Add any other custom fields dynamically
    Object.keys(item).forEach((key) => {
      if (
        ![
          'title',
          'description',
          'image',
          'imagePreview',
          'toolsUsed',
        ].includes(key)
      ) {
        groupConfig[key] = [item[key]];
      }
    });

    return this.fb.group(groupConfig);
  }

  /* ---------------- DIALOG ---------------- */

  openStagePopup(): void {
    this.openItemPopup(this.stagesArray, 'Create New Stage');
  }

  openServiceValuePopup(): void {
    this.openItemPopup(this.serviceValuesArray, 'Create New Value');
  }

  openServiceResultPopup(): void {
    this.openItemPopup(
      this.serviceResultsArray,
      'Create New Results & Impacts'
    );
  }

  openBenefitsInsightPopup(): void {
    const ref = this.dialogService.open(StageFormComponent, {
      header: 'Create New Insight',
      width: '600px',
    });

    ref.onClose.subscribe((data: ServiceItemFormValue | null) => {
      if (!data) return;

      // For benefits insights, create a group with title and number fields
      const insightGroup = this.fb.group({
        title: [data.title, Validators.required],
        number: [''],
      });

      this.benefitsInsightsArray.push(insightGroup);
    });
  }

  addBenefitsInsight(): void {
    if (this.benefitsInsightsArray.length < 3) {
      const insightGroup = this.fb.group({
        title: [''],
        number: [''],
      });
      this.benefitsInsightsArray.push(insightGroup);
    }
  }

  private openItemPopup(targetArray: FormArray, header: string): void {
    let component;

    if (header.includes('Stage')) {
      component = StageFormComponent;
    } else if (header.includes('Value')) {
      component = ValueFormComponent;
    } else if (header.includes('Results')) {
      component = ResultsFormComponent;
    } else if (header.includes('Insight')) {
      component = StageFormComponent; // Reuse for insights
    } else {
      component = StageFormComponent;
    }

    const ref = this.dialogService.open(component, {
      header,
      width: '600px',
    });

    ref.onClose.subscribe((data: ServiceItemFormValue | null) => {
      if (!data) return;

      const processedData: ServiceItemFormValue = { ...data };

      // Handle image preview for items with images
      if (data.image) {
        processedData.imagePreview = URL.createObjectURL(data.image);
      }

      // Preserve toolsUsed array if it exists
      if (data.toolsUsed && Array.isArray(data.toolsUsed)) {
        processedData.toolsUsed = data.toolsUsed;
      }

      targetArray.push(this.createItemGroup(processedData));
    });
  }

  /* ---------------- TABLE ACTIONS ---------------- */

  onDeleteStage(index: number): void {
    this.removeFromArray(this.stagesArray, index);
  }

  onDeleteServiceValue(index: number): void {
    this.removeFromArray(this.serviceValuesArray, index);
  }

  onDeleteServiceResult(index: number): void {
    this.removeFromArray(this.serviceResultsArray, index);
  }

  onDeleteBenefitsInsight(index: number): void {
    this.removeFromArray(this.benefitsInsightsArray, index);
  }

  onReorder(data: any): void {
    // Handle both array and event object formats
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.stagesArray.clear();
    items.forEach((item) => this.stagesArray.push(this.createItemGroup(item)));
  }

  onReorderServiceValues(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.serviceValuesArray.clear();
    items.forEach((item) =>
      this.serviceValuesArray.push(this.createItemGroup(item))
    );
  }

  onReorderServiceResults(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.serviceResultsArray.clear();
    items.forEach((item) =>
      this.serviceResultsArray.push(this.createItemGroup(item))
    );
  }

  onReorderBenefitsInsights(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.benefitsInsightsArray.clear();
    items.forEach((item) =>
      this.benefitsInsightsArray.push(this.createItemGroup(item))
    );
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
