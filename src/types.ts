export type ImageSize = '1K' | '2K' | '4K';
export type VideoAspectRatio = '16:9' | '9:16';
export type VideoResolution = '720p' | '1080p';
export type LogoAspectRatio = '1:1' | '16:9' | '4:3' | '9:16';

export interface GeneratedLogo {
  id: string;
  companyName: string;
  industry: string;
  description: string;
  style: string;
  colors: string;
  imageUrl: string;
  imageSize: ImageSize;
  aspectRatio: LogoAspectRatio;
  createdAt: number;
  promptUsed?: string;
  isUploaded?: boolean;
}

export interface VideoJob {
  operationName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  aspectRatio: VideoAspectRatio;
  resolution: VideoResolution;
  prompt: string;
  startedAt: number;
  error?: string;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  badge: string;
  iconName: string;
}

export interface MotionPreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  iconName: string;
  tag: string;
}

export interface BrandConceptPreset {
  name: string;
  industry: string;
  description: string;
  style: string;
  colors: string;
}
