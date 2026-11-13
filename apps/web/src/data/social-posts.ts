export type SocialPost = {
  id: string;
  platform: 'instagram' | 'tiktok';
  href: string;
  image: string;
  alt: string;
};

export const SOCIAL_POSTS: SocialPost[] = [];
