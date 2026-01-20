import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { debounceTime } from 'rxjs';

export interface FilterItems {
    name?: string;
    type?: 'filter' | 'search' | 'btn' | 'select';
    label?: string;
    placeholder?: string;
    filterOptions?: FilterOption[];
    DDOption?: OptionsFilter[];
    multiple?: boolean;
    btnIcon?: string;
    btnSeverity?: 'primary' | 'danger' |'white';
    btnCallback?: (e:Event) => void;
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
    IconField
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})

export class FiltersComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    formFilter!: FormGroup;
    @Input() filterConfig: FilterItems[] = [];
    @Output() filterChange = new EventEmitter<any>();

    ngOnInit() {
      this.initFilterForm();
      this.setInputsListeners();
    }

  private initFilterForm() {
      const fields: any = {};
      this.filterConfig?.forEach((field: any) => {
          if (field.type != 'btn' && field.type != 'filter') {
              fields[field.name] = field.multiple ? [[]] : [null];
          }
          if (field.type === 'filter') {
              field.filterOptions.forEach((f:FilterOption) => {
                  fields[f.inputName] = [null];
              });
          }
      });
      this.formFilter = this.fb.group(fields);
      console.log('Initialized Filter Form:', this.formFilter.value);
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
      } else if (field.type !== 'btn' && field.type !== 'filter' && field.name) {
        const control = this.formFilter.get(field.name);
        if (control) {
          control.valueChanges.pipe(debounceTime(4)).subscribe(() => {
            this.filterChange.emit(this.formFilter.value);
          });
        }
      }
      if (field.type === 'filter') {
        field.filterOptions.forEach((f: FilterOption) => {
          const control = this.formFilter.get(f.inputName);
          if (control) {
            control.valueChanges.pipe(debounceTime(4)).subscribe(() => {
              this.filterChange.emit(this.formFilter.value);
            });
          }
        });
      }
    });
  }
      
}
