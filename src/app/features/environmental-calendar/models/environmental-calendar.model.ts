export type EnvironmentalEventFormAction = 'save' | 'saveAndCreateNew' | 'cancel';

export interface EnvironmentalEvent {
  id: string;
  /** Localized display title for the table (current UI language). */
  title: string;
  title_en: string;
  title_ar: string;
  /** Slug: global | special */
  event_type: string;
  /** Localized label for the table. */
  event_type_label: string;
  /** Slug: water | earth | air */
  event_color: string;
  /** ISO date string (YYYY-MM-DD). */
  event_date: string;
  /** Relative media path OR absolute URL (table supports both). */
  image: string;
  status: boolean;
}

export interface EnvironmentalEventFormPayload {
  title_en: string;
  title_ar: string;
  event_type: string;
  event_color: string;
  /** ISO date string (YYYY-MM-DD). */
  event_date: string;
  image: File | string | null;
}

export interface EnvironmentalEventFormEvent {
  action: EnvironmentalEventFormAction;
  formData?: EnvironmentalEventFormPayload;
}
