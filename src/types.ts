export type IconType = 'badge' | 'horns' | 'skull' | 'pick' | 'oktubre';

export interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
  whatsapp: string;
}

export interface StationConfig {
  stationName: string;
  subtitle: string;
  streamUrl: string;
  coverUrl: string;
  currentArtist: string;
  currentTrack: string;
  currentAlbum: string;
  footerSlogan: string;
  iconType: IconType;
  socialLinks: SocialLinks;
}

export type StreamStatus = 'idle' | 'connecting' | 'playing' | 'paused' | 'error';

export interface RadioProgram {
  time: string;
  title: string;
  host: string;
  genre: string;
  isLiveNow?: boolean;
}
