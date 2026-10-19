export interface LiveSong {
  id: string;
  text: string;
  artist: string;
  title: string;
  album: string;
  genre: string;
  art: string;
  lyrics?: string;
}

export interface NowPlayingData {
  elapsed: number;
  remaining: number;
  duration: number;
  playlist: string;
  song: LiveSong;
}

export interface SongHistoryItem {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  song: LiveSong;
}

export interface StationData {
  id: number;
  name: string;
  shortcode: string;
  description: string;
  frontend: string;
  backend: string;
  timezone: string;
  listen_url: string;
  public_player_url: string;
}

export interface RadioMetadataResponse {
  station: StationData;
  listeners: {
    total: number;
    unique: number;
    current: number;
  };
  live: {
    is_live: boolean;
    streamer_name: string;
    broadcast_start: number | null;
  };
  now_playing: NowPlayingData;
  playing_next?: {
    song: LiveSong;
    duration: number;
  };
  song_history: SongHistoryItem[];
  is_online: boolean;
}
