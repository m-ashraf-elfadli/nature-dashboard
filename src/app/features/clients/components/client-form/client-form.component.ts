import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { GalleryUploadComponent } from "../../../../shared/components/gallery-upload/gallery-upload.component";

@Component({
  selector: 'app-client-form',
  imports: [InputTextModule, GalleryUploadComponent],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {

}
