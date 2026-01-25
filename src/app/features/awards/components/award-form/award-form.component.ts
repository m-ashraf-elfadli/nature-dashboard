import { Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { FormActionsComponent } from "../../../../shared/components/form-actions/form-actions.component";
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { EditorModule } from 'primeng/editor';
import { GalleryUploadComponent } from "../../../../shared/components/gallery-upload/gallery-upload.component";
import { SettingsComponent } from "../../../../shared/components/settings/settings.component";

@Component({
  selector: 'app-award-form',
  imports: [
    PageHeaderComponent,
    FormActionsComponent,
    TranslateModule,
    InputTextModule,
    DatePickerModule,
    EditorModule,
    GalleryUploadComponent,
    SettingsComponent
],
  templateUrl: './award-form.component.html',
  styleUrl: './award-form.component.scss'
})
export class AwardFormComponent implements OnInit{
  private readonly fb = inject(FormBuilder)
  form!:FormGroup;




  ngOnInit(): void {
    this.initForm()
  }
  initForm(){
    this.form = this.fb.group({
      name:[null,Validators.required],
      description:[null,Validators.required],
      image:[null],
      date:[null,Validators.required],
      organizations_logos:[null]
    })
  }
  onDiscard(event: Event) {
    console.log(event);
  }
  onSave(event: Event) {
    this.form.markAllAsTouched()
  }
  onLanguageChange(event: Event) {
    console.log(event);
  }
}
