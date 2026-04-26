import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface InputSwitchChangeEvent {
  originalEvent: Event;
  checked: boolean;
}

@Component({
  selector: 'app-input-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-switch.component.html',
  styleUrl: './input-switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSwitchComponent),
      multi: true,
    },
  ],
})
export class InputSwitchComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() style: { [klass: string]: any } | null | undefined;
  @Input() styleClass: string | undefined;
  @Input() tabindex: number | undefined;
  @Input() inputId: string | undefined;
  @Input() name: string | undefined;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() trueValue: any = true;
  @Input() falseValue: any = false;
  @Input() ariaLabel: string | undefined;
  @Input() ariaLabelledBy: string | undefined;
  @Input() autofocus = false;

  @Output() onChange = new EventEmitter<InputSwitchChangeEvent>();

  @ViewChild('switchButton') switchButton?: ElementRef<HTMLButtonElement>;

  modelValue: any = this.falseValue;
  focused = false;

  private onModelChange: (value: any) => void = () => {};
  private onModelTouched: () => void = () => {};

  ngAfterViewInit(): void {
    if (this.autofocus) {
      this.switchButton?.nativeElement.focus();
    }
  }

  writeValue(value: any): void {
    this.modelValue = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onModelTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  checked(): boolean {
    return Object.is(this.modelValue, this.trueValue);
  }

  onClick(event: Event): void {
    if (this.disabled || this.readonly) {
      return;
    }

    const nextValue = this.checked() ? this.falseValue : this.trueValue;
    this.modelValue = nextValue;
    this.onModelChange(nextValue);
    this.onModelTouched();
    this.onChange.emit({
      originalEvent: event,
      checked: this.checked(),
    });
  }

  onFocus(): void {
    this.focused = true;
  }

  onBlur(): void {
    this.focused = false;
    this.onModelTouched();
  }
}
