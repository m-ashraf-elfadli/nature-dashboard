import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ServicesService } from '../../../services/services.service';

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

  StageFormComponent = StageFormComponent;
  ValueFormComponent = ValueFormComponent;
  ResultsFormComponent = ResultsFormComponent;

  constructor(
    private fb: FormBuilder,
    private dialogService: AppDialogService,
    private servicesService: ServicesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      tagline: ['', Validators.required],
      status: [1],

      steps: this.fb.array([]),
      values: this.fb.array([]),
      impacts: this.fb.array([]),

      // Benefits section
      benefitEnabled: [true],
      benefitTitle: [''],
      benefitTagline: [''],
      benefitBody: [''],
      benefitInsights: this.fb.array([
        this.fb.group({ metricTitle: [''], metricNumber: [''] }),
      ]),
    });

    // Subscribe to benefitEnabled changes to enable/disable benefits fields
    this.serviceForm
      .get('benefitEnabled')
      ?.valueChanges.subscribe((enabled) => {
        this.toggleBenefitsFields(enabled);
      });
  }

  private toggleBenefitsFields(enabled: boolean): void {
    const benefitsFields = ['benefitTitle', 'benefitTagline', 'benefitBody'];
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

    // Handle benefitInsights array - disable/enable all controls
    this.benefitInsightsArray.controls.forEach((group) => {
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
    { field: 'actions', header: 'Actions', type: 'edit-action' },
    { field: 'actions', header: '', type: 'delete-action' },
  ];

  /* ---------------- FORM ARRAYS ---------------- */

  get stagesArray(): FormArray {
    return this.serviceForm.get('steps') as FormArray;
  }

  get serviceValuesArray(): FormArray {
    return this.serviceForm.get('values') as FormArray;
  }

  get serviceResultsArray(): FormArray {
    return this.serviceForm.get('impacts') as FormArray;
  }

  get benefitInsightsArray(): FormArray {
    return this.serviceForm.get('benefitInsights') as FormArray;
  }

  get benefitEnabledControl(): FormControl {
    return this.serviceForm.get('benefitEnabled') as FormControl;
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

  get benefitInsights(): ServiceItemFormValue[] {
    return this.benefitInsightsArray.value;
  }

  getInsightControl(index: number, field: string) {
    return this.benefitInsightsArray.at(index)?.get(field);
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
      'Create New Results & Impacts',
    );
  }

  addBenefitsInsight(): void {
    if (this.benefitInsightsArray.length < 3) {
      const insightGroup = this.fb.group({
        metricTitle: [''],
        metricNumber: [''],
      });
      this.benefitInsightsArray.push(insightGroup);
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
    this.removeFromArray(this.benefitInsightsArray, index);
  }

  onEditStage(result: any): void {
    if (!result) return;

    // Handle the result structure from the edit dialog
    const updatedData = result.rowData || result;
    const index = result.index;

    if (index !== undefined && this.stagesArray.at(index)) {
      // Update the form control at the given index
      this.stagesArray.at(index).patchValue(updatedData);
    }
  }

  onEditServiceValue(result: any): void {
    console.log(result);

    const updatedData = result.rowData || result;
    const index = result.index;

    if (index !== undefined && this.serviceValuesArray.at(index)) {
      this.serviceValuesArray.at(index).patchValue(updatedData);
    }
  }

  onEditServiceResult(result: any): void {
    if (!result) return;

    const updatedData = result.rowData || result;
    const index = result.index;

    if (index !== undefined && this.serviceResultsArray.at(index)) {
      this.serviceResultsArray.at(index).patchValue(updatedData);
    }
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
      this.serviceValuesArray.push(this.createItemGroup(item)),
    );
  }

  onReorderServiceResults(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.serviceResultsArray.clear();
    items.forEach((item) =>
      this.serviceResultsArray.push(this.createItemGroup(item)),
    );
  }

  onReorderbenefitInsights(data: any): void {
    const items = Array.isArray(data) ? data : data?.value || [];
    if (!Array.isArray(items) || items.length === 0) return;

    this.benefitInsightsArray.clear();
    items.forEach((item) =>
      this.benefitInsightsArray.push(this.createItemGroup(item)),
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
    const formData = new FormData();

    this.appendFormData(formData, this.serviceForm.value);

    this.servicesService.createService(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/services']);
      },
      error: (err) => console.log(err),
    });
  }

  appendFormData(formData: FormData, data: any, parentKey: string = '') {
    if (data === null || data === undefined) return;

    if (data instanceof File) {
      formData.append(parentKey, data);
      return;
    }

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        this.appendFormData(formData, item, `${parentKey}[${index}]`);
      });
      return;
    }

    if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        if (key.endsWith('imagePreview') || key.includes('[imagePreview]')) {
          return;
        }
        const newKey = parentKey ? `${parentKey}[${key}]` : key;

        this.appendFormData(formData, data[key], newKey);
      });
      return;
    }

    // primitive values
    formData.append(parentKey, data);
  }

  onLanguageChange(event: any): void {
    console.log(event);
  }
}
