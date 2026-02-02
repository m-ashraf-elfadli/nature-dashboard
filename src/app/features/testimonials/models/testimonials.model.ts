// Testimonial entity interface
export interface Testimonial {
    id: string;
    clientName: string;
    jobTitle: string;
    Testimonial: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

// Form action types
export type TestimonialFormAction = 'save' | 'cancel' | 'saveAndCreateNew';

// Form event interface
export interface TestimonialFormEvent {
    action: TestimonialFormAction;
    formData: FormData;
}

// API Response interfaces
export interface TestimonialResponse {
    status: string;
    message: string;
    result: Testimonial;
}

export interface TestimonialListResponse {
    status: string;
    message: string;
    result: Testimonial[];
    page: number;
    size: number;
    total: number;
    lastPage: number;
}