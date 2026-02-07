export interface Answer {
  id: string;
  answer_en: string;
  answer_ar: string;
  is_accepted: boolean;
  question_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Question {
  id: string;
  question?: string; // For list view (single language)
  question_en?: string; // For edit/detail view
  question_ar?: string; // For edit/detail view
  status: boolean;
  answers?: Answer[];
  created_at: string;
  updated_at: string;
}

// Form action types
export type QuestionFormAction = 'save' | 'cancel' | 'saveAndCreateNew';

// Form event interface
export interface QuestionFormEvent {
  action: QuestionFormAction;
  formData: any;
}

// API Response interfaces
export interface QuestionResponse {
  status: string;
  message: string;
  result: Question;
}

export interface QuestionListResponse {
  status: string;
  message: string;
  result: Question[];
  page: number;
  size: number;
  total: number;
  lastPage: number;
}
