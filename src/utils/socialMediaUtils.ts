
import { SocialMediaLinks } from '@/types/tournamentSearch';

export const normalizeSocialMediaLinks = (links: any): SocialMediaLinks | null => {
  if (!links || typeof links !== 'object') {
    return null;
  }

  const normalized: SocialMediaLinks = {};
  
  // Handle common social media platforms
  const platforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
  
  platforms.forEach(platform => {
    if (links[platform] && typeof links[platform] === 'string') {
      normalized[platform] = links[platform];
    }
  });

  // Handle any additional platforms not in the predefined list
  Object.keys(links).forEach(key => {
    if (!platforms.includes(key) && typeof links[key] === 'string') {
      normalized[key] = links[key];
    }
  });

  return Object.keys(normalized).length > 0 ? normalized : null;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatSocialMediaUrl = (url: string, platform: string): string => {
  if (!url) return '';
  
  // If already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle platform-specific URL formatting
  switch (platform.toLowerCase()) {
    case 'facebook':
      return `https://facebook.com/${url}`;
    case 'twitter':
      return `https://twitter.com/${url}`;
    case 'instagram':
      return `https://instagram.com/${url}`;
    case 'linkedin':
      return `https://linkedin.com/in/${url}`;
    case 'youtube':
      return `https://youtube.com/${url}`;
    default:
      return url.startsWith('www.') ? `https://${url}` : url;
  }
};
