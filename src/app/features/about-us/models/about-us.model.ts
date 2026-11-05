import { ApiLocalizationStatus, LocaleStatus } from '../../../shared/utils/api-date.util';

// ---------- API (GET/POST /about-us) ----------

export interface AboutUsApi {
  id: string | null;
  sectionTitle: string | null;
  sectionDescription: string | null;
  highlightsPublish: boolean;
  highlights: { id?: string; title: string | null; description: string | null }[];
  statisticsPublish: boolean;
  statistics: { id?: string; metricValue: string | null; label: string | null }[];
  founderImage: string | null;
  founderName: string | null;
  founderTitle: string | null;
  status: boolean;
  localizationStatus?: { en: ApiLocalizationStatus; ar: ApiLocalizationStatus };
  createdAt?: string | null;
  updatedAt?: string | null;
}

// ---------- form model ----------

export interface AboutUsHighlight {
  id?: string | null;
  title: string;
  description: string;
}

export interface AboutUsStatistic {
  id?: string | null;
  value: string;
  label: string;
}

export interface AboutUs {
  title: string;
  description: string;
  highlights_enabled: boolean;
  highlights: AboutUsHighlight[];
  statistics_enabled: boolean;
  statistics: AboutUsStatistic[];
  /** Full media URL. */
  founder_image: string | null;
  founder_name: string;
  founder_title: string;
  /** 1 = published, 0 = unpublished (app-settings convention). */
  status: number;
  localeStatus: { en: LocaleStatus; ar: LocaleStatus };
  /** ISO date. */
  updated_at: string | null;
}

/** Form value sent to `POST /about-us`. */
export interface AboutUsPayload
  extends Omit<AboutUs, 'founder_image' | 'localeStatus' | 'updated_at'> {
  /** A new File to upload, the current URL to keep it, or null to remove it. */
  founder_image: File | string | null;
}

export const ABOUT_US_LIMITS = {
  highlights: 3,
  statistics: 4,
} as const;

/** Field lengths enforced by the API. */
export const ABOUT_US_LENGTHS = {
  title: { min: 3, max: 255 },
  description: { min: 3, max: 2000 },
  highlightTitle: { min: 3, max: 255 },
  highlightDescription: { min: 3, max: 1000 },
  metricValue: { max: 50 },
  metricLabel: { min: 2, max: 255 },
  founderName: { min: 3, max: 255 },
  founderTitle: { min: 3, max: 255 },
} as const;
