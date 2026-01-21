import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-gallery-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-upload.component.html',
  styleUrl: './gallery-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GalleryUploadComponent),
      multi: true,
    },
  ],
})
export class GalleryUploadComponent implements ControlValueAccessor {
  @Input() multiple: boolean = false;
  @Input() label: string = '';
  @Input() dimensions: string = '';
  @Input() maxSize: number = 100;
  @Input() formControlName: string = '';
  @Output() fileSelected = new EventEmitter<File | File[]>();

  images: (string | ArrayBuffer)[] = [];
  isDragOver: boolean = false;

  private onChange: (value: File | File[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  private handleFiles(files: File[]) {
    const validFiles: File[] = [];

    files.forEach((file) => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        console.warn(`File ${file.name} is not an image`);
        return;
      }

      // Check file size
      if (file.size / (1024 * 1024) > this.maxSize) {
        console.warn(`File ${file.name} exceeds ${this.maxSize}MB limit`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    if (this.multiple) {
      // Multiple mode: add to existing images
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push(e.target?.result as string | ArrayBuffer);
        };
        reader.readAsDataURL(file);
      });
      this.onChange(validFiles);
      this.fileSelected.emit(validFiles);
    } else {
      // Single mode: replace existing image
      const file = validFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.images = [e.target?.result as string | ArrayBuffer];
      };
      reader.readAsDataURL(file);
      this.onChange(file);
      this.fileSelected.emit(file);
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    if (this.images.length === 0) {
      this.onChange(null);
    }
  }

  // ControlValueAccessor methods
  writeValue(obj: any): void {
    if (obj) {
      // If value is set externally
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}
