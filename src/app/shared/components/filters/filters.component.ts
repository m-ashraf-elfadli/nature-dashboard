import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Popover, PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { debounceTime } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ImportService } from '../../services/import.service';

export interface FilterItems {
  name?: string;
  type?: 'filter' | 'search' | 'btn' | 'select' | 'import';
  label?: string;
  placeholder?: string;
  filterOptions?: FilterOption[];
  DDOption?: OptionsFilter[];
  multiple?: boolean;
  btnIcon?: string;
  btnSeverity?: 'primary' | 'danger' | 'white' | 'primary-outline';
  anmSeverity?: 'bg-grow' | 'expand' | 'expand-gap';
  btnCallback?: (e: Event) => void;
  importEndpoint?: string;
  downloadTemplateEndpoint?: string;
  templateHeadersEndpoint?: string;
  templateHeaders?: string[];
  templateFileName?: string;
  importFieldName?: string;
  acceptedFileTypes?: string;
  importCallback?: () => void;
}
export interface FilterOption {
  type?: 'input' | 'select' | "date";
  inputType?: "text" | "number";
  placeholder?: string;
  multiple?: boolean;
  label: string;
  inputName: string;
  options?: OptionsFilter[];
}
export interface OptionsFilter {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-filters',
  imports: [
    ReactiveFormsModule,
    PopoverModule,
    InputTextModule,
    SelectModule,
    CalendarModule,
    CheckboxModule,
    MultiSelectModule,
    InputIcon,
    IconField,
    TranslateModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})

export class FiltersComponent implements OnInit, OnChanges {
  @ViewChild('op') op!: Popover;
  private readonly fb = inject(FormBuilder);
  private readonly importService = inject(ImportService);
  formFilter!: FormGroup;
  @Input() filterConfig: FilterItems[] = [];
  @Output() filterChange = new EventEmitter<any>();

  ngOnInit() {
    this.initFilterForm();
    this.setInputsListeners();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterConfig']) {
      this.initFilterForm();
      this.setInputsListeners();
    }
  }

  private initFilterForm() {
    const fields: any = {};
    this.filterConfig?.forEach((field: any) => {
      if (field.type != 'btn' && field.type != 'filter' && field.type != 'import') {
        fields[field.name] = field.multiple ? [[]] : [null];
      }
      if (field.type === 'filter') {
        field.filterOptions.forEach((f: FilterOption) => {
          fields[f.inputName] = [null];
        });
      }
    });
    this.formFilter = this.fb.group(fields);
  }
  setInputsListeners() {
    this.filterConfig?.forEach((field: any) => {
      if (field.type === 'search' && field.name) {
        const control = this.formFilter.get(field.name);
        if (control) {
          control.valueChanges.pipe(debounceTime(400)).subscribe(() => {
            this.filterChange.emit(this.formFilter.value);
          });
        }
      } else if (field.type !== 'btn' && field.type !== 'filter' && field.type !== 'import' && field.name) {
        const control = this.formFilter.get(field.name);
        if (control) {
          control.valueChanges.pipe(debounceTime(4)).subscribe(() => {
            this.filterChange.emit(this.formFilter.value);
          });
        }
      }
      // if (field.type === 'filter') {
      //   field.filterOptions.forEach((f: FilterOption) => {
      //     const control = this.formFilter.get(f.inputName);
      //     if (control) {
      //       control.valueChanges.pipe(debounceTime(4)).subscribe(() => {
      //         this.filterChange.emit(this.formFilter.value);
      //       });
      //     }
      //   });
      // }
    });
  }
  applyFilter(e: Event) {
    this.filterChange.emit(this.formFilter.value);
    this.op.toggle(e);
  }
  resetFilter(e: Event) {
    this.formFilter.reset();
    this.op.toggle(e);
  }

  importFile(event: Event, item: FilterItems) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !item.importEndpoint) {
      input.value = '';
      return;
    }

    this.importService
      .importFile(item.importEndpoint, file, item.importFieldName)
      .subscribe({
        next: () => item.importCallback?.(),
        complete: () => {
          input.value = '';
        },
        error: () => {
          input.value = '';
        },
      });
  }

  downloadTemplate(item: FilterItems) {
    const fileName = item.templateFileName || 'template.csv';

    if (item.downloadTemplateEndpoint) {
      this.importService.downloadTemplate(item.downloadTemplateEndpoint).subscribe({
        next: (blob) => this.importService.downloadBlob(blob, fileName),
      });
      return;
    }

    if (item.templateHeadersEndpoint) {
      this.importService.getTemplateHeaders(item.templateHeadersEndpoint).subscribe({
        next: (headers) => this.importService.downloadTemplateFromHeaders(headers, fileName),
      });
      return;
    }

    if (item.templateHeaders?.length) {
      this.importService.downloadTemplateFromHeaders(item.templateHeaders, fileName);
    }
  }

}
