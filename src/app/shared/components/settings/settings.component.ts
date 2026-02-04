import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Select } from 'primeng/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface StatusOptions {
  label: string;
  value: number;
}

export interface StatusConfig {
  text: string;
  class: string;
}

@Component({
  selector: 'app-settings',
  imports: [Select, CommonModule, FormsModule, TranslateModule],
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
  private readonly translate = inject(TranslateService);

  statusOptions: StatusOptions[] = [
    { label: this.translate.instant('settings.published'), value: 1 },
    { label: this.translate.instant('settings.unpublished'), value: 0 },
  ];

  value: number = 1;

  // Language statuses: 0 = not-started, 1 = ongoing, 2 = completed
  private _englishStatus: number = 0;
  private _arabicStatus: number = 0;

  @Input()
  set englishStatus(value: number) {
    this._englishStatus = value;
  }
  get englishStatus(): number {
    return this._englishStatus;
  }

  @Input()
  set arabicStatus(value: number) {
    this._arabicStatus = value;
  }
  get arabicStatus(): number {
    return this._arabicStatus;
  }

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

  statusView(value: number): StatusConfig {
    const STATUS_MAP: Record<number, StatusConfig> = {
      0: {
        text: this.translate.instant('settings.status_not_started'),
        class: 'status-not-started',
      },
      1: {
        text: this.translate.instant('settings.status_ongoing'),
        class: 'status-ongoing',
      },
      2: {
        text: this.translate.instant('settings.status_completed'),
        class: 'status-completed',
      },
    };

    return STATUS_MAP[value] ?? STATUS_MAP[1];
  }
}
