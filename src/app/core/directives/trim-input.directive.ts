import { Directive, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[trimInput]',
  standalone: true,
})
export class TrimInputDirective {
  constructor(@Optional() @Self() private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(e: Event) {
    const el = e.target as HTMLInputElement | HTMLTextAreaElement;
    const value = el.value;

    // لو كله مسافات خليها فاضية
    const normalized = value.replace(/^\s+/, '');

    if (normalized !== value) {
      el.value = normalized;
      this.ngControl?.control?.setValue(normalized, { emitEvent: false });
    }
  }

  // trim كامل عند الخروج من الحقل (قبل submit غالبًا)
  @HostListener('blur')
  onBlur() {
    const c = this.ngControl?.control;
    const v = c?.value;

    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (trimmed !== v) c?.setValue(trimmed);
    }
  }
}
