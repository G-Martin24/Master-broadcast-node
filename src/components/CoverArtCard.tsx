import React from 'react';
import { Radio, Disc, Sparkles } from 'lucide-react';
import { StreamStatus } from '../types';
import rockLogoImg from '../assets/images/rock_metal_radio_logo_1792430917541.jpg';

interface CoverArtCardProps {
  coverUrl: string;
  artist: string;
  track: string;
  album: string;
  status: StreamStatus;
  stationName: string;
  listenersCount?: number;
  onOpenMetadata?: () => void;
  onNextTrackPreset?: () => void;
}

export function CoverArtCard({
  coverUrl,
  artist,
  track,
  album,
  status,
  stationName,
  listenersCount,
  onOpenMetadata,
  onNextTrackPreset,
}: CoverArtCardProps) {
  const isPlaying = status === 'playing';

  return (
    <div className="w-full flex flex-row items-center gap-4 py-2">
      {/* Cover Art Box with vinyl frame & red neon perimeter */}
      <div className="relative shrink-0 w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden p-[2px] bg-gradient-to-b from-zinc-700 via-zinc-900 to-black shadow-[0_8px_20px_rgba(0,0,0,0.8)] border border-red-950/60 group">
        {/* Glowing border accent */}
        <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${isPlaying ? 'border border-[#FF2020]/70 shadow-[inset_0_0_12px_rgba(255,32,32,0.4)]' : 'border border-white/10'}`} />

        <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-zinc-950">
          <img
            key={coverUrl}
            src={coverUrl}
            alt={`${artist} - ${track}`}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100 group-hover:scale-105'}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = rockLogoImg || '/logo-rock-metal.jpg';
            }}
          />

          {/* Vignette & subtle grunge grain */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Vinyl rotating indicator when playing */}
          {isPlaying && (
            <div className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/70 backdrop-blur-sm border border-red-500/40 text-red-400 animate-spin" style={{ animationDuration: '6s' }}>
              <Disc size={14} />
            </div>
          )}
        </div>
      </div>

      {/* Track & Broadcast Metadata */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* EN VIVO Badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E50914] text-white text-[11px] font-bold tracking-wide uppercase shadow-[0_0_10px_rgba(229,9,20,0.7)] select-none">
            <span className={`w-2 h-2 rounded-full bg-white ${isPlaying ? 'animate-ping' : ''}`} />
            <span>((•)) EN VIVO</span>
          </div>
          <span className="text-[11px] font-medium text-zinc-400 truncate">
            {status === 'playing' ? 'Transmitiendo ahora' : status === 'connecting' ? 'Conectando...' : 'En pausa'}
          </span>
        </div>

        {/* Artist Name */}
        <h2 className="font-display text-lg md:text-xl font-bold text-white tracking-wide truncate leading-tight drop-shadow-sm">
          {artist}
        </h2>

        {/* Track Title */}
        <p className="text-sm md:text-base font-semibold text-zinc-200 truncate mt-0.5">
          {track}
        </p>

        {/* Album & Year */}
        <p className="text-[11px] md:text-xs font-mono text-zinc-400 uppercase tracking-wider truncate mt-0.5">
          {album}
        </p>

        {/* Station subtitle ticker & preset changer / metadata */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-medium text-red-500/90 uppercase tracking-widest flex items-center gap-1 truncate">
              <Radio size={11} className="shrink-0" />
              <span className="truncate">{stationName}</span>
            </span>

            {listenersCount !== undefined && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-white/10 text-emerald-400 shrink-0">
                {listenersCount} oye.
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onOpenMetadata && (
              <button
                onClick={onOpenMetadata}
                title="Ver metadatos completos y canciones anteriores"
                className="text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-zinc-900/90 border border-red-500/30 hover:border-red-500/60"
              >
                <Sparkles size={10} className="text-red-400" />
                <span>Info en vivo</span>
              </button>
            )}
            {onNextTrackPreset && !onOpenMetadata && (
              <button
                onClick={onNextTrackPreset}
                title="Cambiar tema de muestra"
                className="text-[10px] text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5"
              >
                <Sparkles size={10} />
                <span>Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
