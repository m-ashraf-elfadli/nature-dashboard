import type { LocaleComplete } from '../../projects/models/projects.interface';

export type BlogFormAction = 'save' | 'saveAndCreateNew' | 'cancel';

export interface BlogCategory {
  id: string;
  /** Localized display name for table (current UI language). */
  name: string;
  name_en: string;
  name_ar: string;
  type_id: string;
  type_label: string;
  /** Relative media path OR absolute URL (table supports both). */
  image: string;
  created_at: string;
  status: boolean;
}

export interface BlogCategoryFormPayload {
  name_en: string;
  name_ar: string;
  type_id: string;
  image: File | string | null;
}

export interface BlogCategoryFormEvent {
  action: BlogFormAction;
  formData?: BlogCategoryFormPayload;
}

/** Section block on blog post (Figma “Blog Section”). */
export interface BlogPostSection {
  id?: string;
  enabled: boolean;
  title: string;
  subtitle_html: string;
  image: string;
  quote: string;
  tags: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_en: string;
  title_ar: string;
  category_id: string;
  category_name: string;
  /** View count for list (Figma “Views”). */
  views: number;
  /** Same shape as services/projects list — completed locales with flags in table. */
  localeComplete: LocaleComplete;
  image: string;
  created_at: string;
  status: boolean;
  sections?: BlogPostSection[];
}

export interface BlogPostSectionFormPayload {
  id?: string;
  enabled: boolean;
  title: string;
  subtitle_html: string;
  image: File | string | null | undefined;
  quote: string;
  tags: string;
}

export interface BlogPostFormPayload {
  title_en: string;
  title_ar: string;
  category_id: string;
  image: File | string | null;
  /** Matches `app-settings`: 1 = published, 0 = unpublished */
  status: number;
  sections: BlogPostSectionFormPayload[];
}


export interface BlogCategoryTypeOption {
  id: string;
  labelKey: string;
}
