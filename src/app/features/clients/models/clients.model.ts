// Client entity interface
export interface Client {
  id: string;
  name: string;
  image: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// Form action types
export type ClientFormActions = 'save' | 'cancel' | 'saveAndCreateNew';

// Form event interface
export interface ClientFormEvent {
  action: ClientFormActions;
  formData: FormData;
}

// API Response interfaces (if needed)
export interface ClientResponse {
  status: string;
  message: string;
  result: Client;
}

export interface ClientListResponse {
  status: string;
  message: string;
  result: Client[];
  page: number;
  size: number;
  total: number;
  lastPage: number;
}
