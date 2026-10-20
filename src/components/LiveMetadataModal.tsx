import React from 'react';
import {
  X,
  Radio,
  Users,
  Music,
  Clock,
  Disc,
  RotateCcw,
  ExternalLink,
  Flame,
  SkipForward,
  History,
  Tag,
} from 'lucide-react';
import { RadioMetadataResponse } from '../types/metadata';
import skullCoverImg from '../assets/images/rock_metal_cover_1792428846792.jpg';

interface LiveMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: RadioMetadataResponse | null;
  isLoading: boolean;
  currentElapsed: number;
  onRefresh: () => void;
}

export function LiveMetadataModal({
  isOpen,
  onClose,
  metadata,
  isLoading,
  currentElapsed,
  onRefresh,
}: LiveMetadataModalProps) {
  if (!isOpen) return null;

  const nowPlaying = metadata?.now_playing;
  const song = nowPlaying?.song;
  const duration = nowPlaying?.duration || 0;
  const nextSong = metadata?.playing_next?.song;
  const history = metadata?.song_history || [];

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentElapsed / duration) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#14141a]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-600/20 text-[#FF2020] border border-red-500/30">
              <Radio size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-rock text-base text-white uppercase tracking-wider">
                Metadatos en Vivo
              </h3>
              <p className="text-[11px] text-zinc-400">
                {metadata?.station?.name || 'Rock y Metal'} • AzuraCast Live Stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              title="Actualizar metadatos"
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <RotateCcw size={16} className={isLoading ? 'animate-spin text-red-400' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Top Live Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
              <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 mb-0.5">
                <Users size={12} className="text-red-400" />
                <span>Oyentes</span>
              </div>
              <span className="font-mono text-sm md:text-base font-bold text-white">
                {metadata?.listeners?.total ?? '—'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
              <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 mb-0.5">
                <Disc size={12} className="text-red-400" />
                <span>Calidad</span>
              </div>
              <span className="font-mono text-xs md:text-sm font-bold text-emerald-400">
                128 kbps MP3
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
              <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 mb-0.5">
                <Flame size={12} className="text-red-400" />
                <span>Emisión</span>
              </div>
              <span className="font-mono text-xs md:text-sm font-bold text-red-400">
                {metadata?.live?.is_live ? 'DJ EN VIVO' : 'AUTODJ'}
              </span>
            </div>
          </div>

          {/* Current Song Playing Card */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#181820] to-[#101015] border border-red-500/30 shadow-[0_0_20px_rgba(229,9,20,0.15)] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-full bg-[#E50914] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                Sonando Ahora
              </span>
              {nowPlaying?.playlist && (
                <span className="text-[10px] text-zinc-400 px-2 py-0.5 rounded bg-zinc-800/80 border border-white/5">
                  Lista: {nowPlaying.playlist}
                </span>
              )}
            </div>

            <div className="flex gap-3.5 items-center">
              {/* Song Album Art */}
              <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/10 bg-zinc-950 shadow-md">
                <img
                  src={song?.art || skullCoverImg || '/assets/images/rock_metal_cover_1792428846792.jpg'}
                  alt={song?.title || 'Cover'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = skullCoverImg || '/assets/images/rock_metal_cover_1792428846792.jpg';
                  }}
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-rock text-base md:text-lg text-white font-bold truncate leading-tight">
                  {song?.title || 'Cargando tema...'}
                </h4>
                <p className="text-sm font-semibold text-red-400 truncate mt-0.5">
                  {song?.artist || 'Rock y Metal Radio'}
                </p>
                {song?.album && (
                  <p className="text-xs text-zinc-400 truncate mt-0.5 font-mono">
                    Álbum: {song.album}
                  </p>
                )}
                {song?.genre && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500">
                    <Tag size={10} />
                    <span className="truncate">{song.genre}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Song Elapsed / Duration Progress Bar */}
            {duration > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#FF2020] h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_#FF2020]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mt-1.5">
                  <span>{formatTime(currentElapsed)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Next Song Queued (if available) */}
          {nextSong && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
                <SkipForward size={14} className="text-red-400" />
                <span>A continuación</span>
              </div>
              <div className="flex items-center gap-3">
                {nextSong.art && (
                  <img
                    src={nextSong.art}
                    alt={nextSong.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded object-cover border border-white/10 shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{nextSong.title}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{nextSong.artist}</p>
                </div>
                {metadata?.playing_next?.duration ? (
                  <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                    {formatTime(metadata.playing_next.duration)}
                  </span>
                ) : null}
              </div>
            </div>
          )}

          {/* Song History Section */}
          {history.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 uppercase tracking-wide">
                  <History size={14} className="text-red-400" />
                  <span>Historial Reciente</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">ÚLTIMAS EMISIONES</span>
              </div>

              <div className="space-y-1.5">
                {history.slice(0, 4).map((item) => (
                  <div
                    key={item.sh_id}
                    className="p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900/70 border border-white/5 flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={item.song.art || skullCoverImg || '/assets/images/rock_metal_cover_1792428846792.jpg'}
                      alt={item.song.title}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded object-cover border border-white/10 shrink-0 bg-zinc-950"
                      onError={(e) => {
                        e.currentTarget.src = skullCoverImg || '/assets/images/rock_metal_cover_1792428846792.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-200 truncate leading-tight">
                        {item.song.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">
                        {item.song.artist} {item.song.album ? `• ${item.song.album}` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {formatTime(item.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Public Link */}
        <div className="p-3.5 border-t border-white/10 bg-[#14141a] flex items-center justify-between text-xs">
          <a
            href="https://cesarradio.realserver.es/public/rock_y_metal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <span>Ver en realserver.es</span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
