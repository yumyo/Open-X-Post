export type PlatformType = 'twitter' | 'instagram' | 'tiktok' | 'tumblr';

export type DestinationPlatform =
  | 'facebook_profile'
  | 'facebook_page'
  | 'instagram'
  | 'tiktok'
  | 'tumblr'
  | 'twitter';

export interface Author {
  name: string;
  handle: string;
  avatar: string;
}

export interface ExtractedMedia {
  platform: PlatformType;
  author: Author;
  text: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  likes: string;
  shares: string;
  originalUrl: string;
}

export type PostTarget = 'profile' | 'page';

export interface ManagedPage {
  id: string;
  name: string;
  category: string;
  followers: string;
  avatar: string;
}

export interface CrossPostLogItem {
  id: string;
  timestamp: string;
  sourcePlatform: PlatformType;
  destination: DestinationPlatform;
  destinationLabel: string;
  videoTitle: string;
  videoUrl: string;
  caption: string;
  status: 'published' | 'downloaded_and_prefilled' | 'scheduled';
  permalink?: string;
}
