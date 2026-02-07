import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputText } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { QuestionFormEvent } from '../../models/questions.model';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-questions-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    InputText,
    RadioButtonModule,
  ],
  templateUrl: './questions-form.component.html',
  styleUrl: './questions-form.component.scss',
})
export class QuestionsFormComponent implements OnInit, OnChanges {
  @Input() questionId?: string;
  @Output() formClose = new EventEmitter<QuestionFormEvent>();

  questionForm!: FormGroup;
  isEditMode = false;
  private fb = inject(FormBuilder);
  private service = inject(QuestionsService);

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionId'] && !changes['questionId'].firstChange) {
      this.checkEditMode();
    }
  }

  checkEditMode() {
    this.isEditMode = !!this.questionId;

    if (this.isEditMode) {
      this.loadQuestionById();
    } else {
      this.answers.clear();
      for (let i = 0; i < 4; i++) {
        this.addAnswer();
      }
    }
  }

  initForm() {
    this.questionForm = this.fb.group({
      question_en: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
        ],
      ],
      question_ar: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
        ],
      ],
      answers: this.fb.array([]),
    });
  }

  createAnswer(answer?: any): FormGroup {
    return this.fb.group({
      id: [answer?.id || null],
      answer_en: [answer?.answer_en || null, Validators.required],
      answer_ar: [answer?.answer_ar || null, Validators.required],
      is_accepted: [answer?.is_accepted || false],
    });
  }

  get answers(): FormArray {
    return this.questionForm?.get('answers') as FormArray;
  }

  setCorrectAnswer(index: number) {
    this.answers.controls.forEach((ctrl, i) => {
      ctrl.patchValue({
        is_accepted: i === index,
      });
    });
  }

  addAnswer(answer?: any) {
    this.answers.push(this.createAnswer(answer));
  }

  submitForm(action: 'save' | 'saveAndCreateNew') {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const payload = {
      question_en: this.questionForm.value.question_en,
      question_ar: this.questionForm.value.question_ar,
      answers: this.questionForm.value.answers.map((a: any) => ({
        id: a.id || undefined,
        answer_en: a.answer_en,
        answer_ar: a.answer_ar,
        is_accepted: a.is_accepted,
      })),
    };

    this.formClose.emit({
      action: action,
      formData: payload,
    });
  }

  loadQuestionById() {
    if (!this.questionId) return;

    this.service.getById(this.questionId).subscribe({
      next: (response) => {
        const result = response.result;

        this.questionForm.patchValue({
          question_en: result.question_en,
          question_ar: result.question_ar,
        });

        this.answers.clear();
        result.answers.forEach((ans: any) => this.addAnswer(ans));
      },
      error: (err) => {
        console.error('Error loading question:', err);
      },
    });
  }

  resetForm() {
    this.questionForm.reset();
    this.answers.clear();

    for (let i = 0; i < 4; i++) {
      this.addAnswer();
    }
  }

  hasCorrectAnswer(): boolean {
    return this.answers.controls.some((ctrl) => ctrl.get('is_accepted')?.value);
  }

  cancel() {
    this.formClose.emit({
      action: 'cancel',
      formData: null,
    });
  }
}
