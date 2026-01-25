import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Select } from 'primeng/select';
export interface StatusOptions {
  label: string;
  value: number;
}
export interface StatusConfig {
  text: string;
  class: string;
}

export const STATUS_MAP: Record<number, StatusConfig> = {
  1: {
    text: 'Ongoing',
    class: 'status-ongoing',
  },
  0: {
    text: 'Not Started',
    class: 'status-not-started',
  },
};

@Component({
  selector: 'app-settings',
  imports: [Select, CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SettingsComponent),
      multi: true,
    },
  ],
})
export class SettingsComponent {
  statusOptions: StatusOptions[] = [
    { label: 'Published', value: 1 },
    { label: 'Unpublished', value: 0 },
  ];

  value: number = 1;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: number): void {
    if (val !== undefined && val !== null) {
      this.value = val;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  englishStatus: number = 1;
  arabicStatus: number = 0;

  readonly STATUS_MAP = STATUS_MAP;

  statusView(value: number) {
    return this.STATUS_MAP[value] ?? this.STATUS_MAP[0];
  }
}
