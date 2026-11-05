/**
 * The API returns dates as `dd/MM/yyyy` (e.g. `16/09/2026`).
 * Converts them to an ISO date so the `date` pipe / formatDate can use them.
 */
export function parseApiDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return value;
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/** `not_started` | `ongoing` | `completed` → app-settings status (0 | 1 | 2). */
export type LocaleStatus = 0 | 1 | 2;
export type ApiLocalizationStatus = 'not_started' | 'ongoing' | 'completed';

export function toLocaleStatus(value: ApiLocalizationStatus | null | undefined): LocaleStatus {
  return value === 'completed' ? 2 : value === 'ongoing' ? 1 : 0;
}

/** Prefixes relative media paths with the media server URL. */
export function toMediaUrl(path: string | null | undefined, mediaUrl: string): string | null {
  if (!path) return null;
  return /^(https?:|data:|blob:)/.test(path) ? path : mediaUrl + path.replace(/^\/+/, '');
}
