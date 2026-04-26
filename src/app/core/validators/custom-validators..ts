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
      if (control.value == '') {
        return null;
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

  static notOnlySpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const textValue = value
        .toString()
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '');

      return textValue.trim().length ? null : { whitespace: true };
    };
  }

  static notOnlySpecialChars(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }

      const textValue = control.value
        .toString()
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();

      return /[\p{L}\p{N}]/u.test(textValue)
        ? null
        : { onlySpecialChars: true };
    };
  }
}
