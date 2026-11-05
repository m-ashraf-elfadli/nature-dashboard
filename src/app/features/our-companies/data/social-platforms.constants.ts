import { SocialPlatform } from '../models/our-companies.model';

export interface SocialPlatformOption {
  value: SocialPlatform;
  label: string;
  /** Same icons the website renders (nature/public/images/footer). */
  icon: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformOption[] = [
  { value: 'youtube', label: 'YouTube', icon: 'images/social/youtube.svg' },
  { value: 'facebook', label: 'Facebook', icon: 'images/social/face.svg' },
  { value: 'instagram', label: 'Instagram', icon: 'images/social/insta.svg' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'images/social/linkedin.svg' },
  { value: 'snapchat', label: 'Snapchat', icon: 'images/social/snapchat.svg' },
  { value: 'x', label: 'X', icon: 'images/social/x.svg' },
  { value: 'tiktok', label: 'TikTok', icon: 'images/social/tiktok.svg' },
];
