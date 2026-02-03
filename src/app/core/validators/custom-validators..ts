import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validator that requires the control's value to be a valid number
   * and not contain invalid characters like 'e', '+', '-', '*', '/'
   */
  static numericOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values to allow optional controls
      }

      const value = control.value.toString();

      // Check for invalid characters
      const invalidChars = /[eE+\-*\/]/;
      if (invalidChars.test(value)) {
        return { numericOnly: true };
      }

      // Check if it's a valid number
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return { numericOnly: true };
      }

      return null;
    };
  }

  /**
   * Validator that requires the control's value to be greater than or equal to min
   */
  static minValue(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null; // Don't validate empty values
      }

      const value = Number(control.value);
      if (isNaN(value)) {
        return null; // Let numericOnly validator handle this
      }

      return value < min ? { minValue: { min, actual: value } } : null;
    };
  }
}
