import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-gallery-upload',
  standalone: true,
  imports: [CommonModule, TranslateModule],
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
  @Input() maxSize: number = 100;
  @Input() formControlName: string = '';
  @Output() fileSelected = new EventEmitter<File | File[]>();
  @Output() removed = new EventEmitter<void>();

  images: (string | ArrayBuffer)[] = [];
  // Track the actual file/URL data separately from display previews
  private filesData: (File | string)[] = [];
  isDragOver: boolean = false;

  // ✅ Fix: Accept any type for onChange to handle mixed arrays
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

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
      // Multiple mode: ADD to existing images (don't replace)
      validFiles.forEach((file) => {
        // Add to internal data tracking
        this.filesData.push(file);

        // Add preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push(e.target?.result as string | ArrayBuffer);
        };
        reader.readAsDataURL(file);
      });

      // Emit the complete array (existing URLs + new Files)
      this.onChange(this.filesData);
      this.fileSelected.emit(validFiles);
    } else {
      // Single mode: replace existing image
      const file = validFiles[0];
      this.filesData = [file];

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
    this.filesData.splice(index, 1);

    if (this.images.length === 0) {
      this.onChange(null);
    } else if (this.multiple) {
      // Emit updated array after removal
      this.onChange(this.filesData);
    } else {
      // Single mode after removal
      this.onChange(null);
    }
    this.removed.emit();
  }

  // ControlValueAccessor methods
  writeValue(obj: any): void {
    if (obj) {
      // Handle array of URLs/Files (for multiple mode)
      if (Array.isArray(obj)) {
        this.filesData = [...obj];
        this.images = [...obj];
      }
      // Handle single URL string
      else if (typeof obj === 'string') {
        this.filesData = [obj];
        this.images = [obj];
      }
      // Handle single File object
      else if (obj instanceof File) {
        this.filesData = [obj];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images = [e.target?.result as string | ArrayBuffer];
        };
        reader.readAsDataURL(obj);
      }
    } else {
      // Clear images when obj is null/undefined
      this.images = [];
      this.filesData = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
