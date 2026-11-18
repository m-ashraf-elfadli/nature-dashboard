import { SocialPlatform } from '../models/our-companies.model';
import { SOCIAL_ICONS } from './social-icons';

export interface SocialPlatformOption {
  value: SocialPlatform;
  label: string;
  /** Inlined data URI (same artwork as the website's images/footer icons). */
  icon: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformOption[] = [
  { value: 'youtube', label: 'YouTube', icon: SOCIAL_ICONS.youtube },
  { value: 'facebook', label: 'Facebook', icon: SOCIAL_ICONS.facebook },
  { value: 'instagram', label: 'Instagram', icon: SOCIAL_ICONS.instagram },
  { value: 'linkedin', label: 'LinkedIn', icon: SOCIAL_ICONS.linkedin },
  { value: 'snapchat', label: 'Snapchat', icon: SOCIAL_ICONS.snapchat },
  { value: 'x', label: 'X', icon: SOCIAL_ICONS.x },
  { value: 'tiktok', label: 'TikTok', icon: SOCIAL_ICONS.tiktok },
];
