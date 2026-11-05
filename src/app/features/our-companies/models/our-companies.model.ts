import { ApiLocalizationStatus, LocaleStatus } from '../../../shared/utils/api-date.util';

/** Platforms offered in the dashboard (each has an icon on the website). */
export type SocialPlatform =
  | 'youtube'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'snapchat'
  | 'x'
  | 'tiktok';

export interface CompanySocialLink {
  /** Existing link id; omitted for new links. */
  id?: string | null;
  platform: SocialPlatform;
  url: string;
}

// ---------- API ----------

/** Row of `GET /companies`. */
export interface CompanyRowApi {
  id: string;
  name: string | null;
  location: string | null;
  logo: string | null;
  servicesCount: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** `GET /companies/show/{id}`. */
export interface CompanyApi {
  id: string;
  name: string | null;
  overview: string | null;
  servicesPublish: boolean;
  serviceIds: string[];
  services?: { id: string; name: string; status?: boolean }[];
  contactPublish: boolean;
  location: string | null;
  email: string | null;
  website: string | null;
  socialPublish: boolean;
  socialLinks: { id?: string; platform: string; url: string }[];
  logo: string | null;
  cardWatermark: string | null;
  cardBackgroundColor: string | null;
  status: boolean;
  localizationStatus?: { en: ApiLocalizationStatus; ar: ApiLocalizationStatus };
  createdAt?: string;
  updatedAt?: string;
}

// ---------- form / table models ----------

export interface Company {
  id: string;
  name: string;
  overview: string;
  services_enabled: boolean;
  /** Ids from the Services module (`GET /services/names`). */
  service_ids: string[];
  contact_enabled: boolean;
  location: string;
  email: string;
  website: string;
  social_enabled: boolean;
  social_links: CompanySocialLink[];
  /** Full media URLs. */
  logo: string | null;
  watermark: string | null;
  /** Single color picked by the admin; the website derives background, leaf and line from it. */
  card_color: string;
  /** 1 = published, 0 = unpublished (app-settings convention). */
  status: number;
  localeStatus: { en: LocaleStatus; ar: LocaleStatus };
}

/** Row shown in the companies table. */
export interface CompanyRow {
  id: string;
  name: string;
  logo: string | null;
  location: string;
  services_label: string;
  updated_label: string;
  status: boolean;
}

/** Form value sent to `POST /companies` / `POST /companies/{id}`. */
export interface CompanyPayload
  extends Omit<Company, 'id' | 'logo' | 'watermark' | 'localeStatus'> {
  /** A new File to upload, or the current URL to keep it. */
  logo: File | string | null;
  /** A new File to upload, the current URL to keep it, or null to remove it. */
  watermark: File | string | null;
}

/** Field lengths enforced by the API. */
export const COMPANY_LENGTHS = {
  name: { min: 3, max: 255 },
  overview: { min: 10, max: 3000 },
  location: { max: 255 },
} as const;

export const COMPANY_IMAGE_MAX_MB = 3;
