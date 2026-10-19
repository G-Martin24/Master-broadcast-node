import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Volume1,
  ListMusic,
  SlidersHorizontal,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { StreamStatus } from '../types';

interface PlayerControlsProps {
  status: StreamStatus;
  volume: number;
  isMuted: boolean;
  errorMessage: string | null;
  onTogglePlay: () => void;
  onReconnect: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onOpenPlaylist: () => void;
  onOpenSettings: () => void;
}

export function PlayerControls({
  status,
  volume,
  isMuted,
  errorMessage,
  onTogglePlay,
  onReconnect,
  onVolumeChange,
  onToggleMute,
  onOpenPlaylist,
  onOpenSettings,
}: PlayerControlsProps) {
  const isPlaying = status === 'playing';
  const isConnecting = status === 'connecting';
  const effectiveVolPercent = isMuted ? 0 : Math.round(volume * 100);

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} className="text-zinc-400 group-hover:text-red-400" />;
    if (volume < 0.5) return <Volume1 size={18} className="text-zinc-300 group-hover:text-white" />;
    return <Volume2 size={18} className="text-zinc-200 group-hover:text-white" />;
  };

  return (
    <div className="w-full flex flex-col gap-4 py-2">
      {/* Error Banner if connection failed */}
      {status === 'error' && errorMessage && (
        <div className="w-full flex items-center justify-between gap-2 p-3 rounded-lg bg-red-950/70 border border-red-600/60 text-red-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onReconnect}
            className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shrink-0 transition-colors"
          >
            Reconectar
          </button>
        </div>
      )}

      {/* Main Transport Control Row */}
      <div className="flex items-center justify-between px-2">
        {/* Playlist / Programming Button */}
        <button
          onClick={onOpenPlaylist}
          title="Ver programación y temas"
          aria-label="Ver programación"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-transform active:scale-90"
        >
          <ListMusic size={20} />
        </button>

        {/* Reconnect / Previous Button */}
        <button
          onClick={onReconnect}
          title="Reiniciar conexión del streaming"
          aria-label="Reiniciar conexión"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-transform active:scale-90"
        >
          <RotateCcw size={19} className={isConnecting ? 'animate-spin' : ''} />
        </button>

        {/* Big Circular Red-Rimmed Play / Pause Button */}
        <div className="relative flex items-center justify-center">
          {/* Animated red halo ring when playing */}
          {isPlaying && (
            <div className="absolute -inset-2.5 rounded-full border-2 border-[#FF2020] animate-pulse-ring pointer-events-none" />
          )}

          <button
            onClick={onTogglePlay}
            disabled={isConnecting}
            aria-label={isPlaying ? 'Pausar transmisión' : 'Reproducir transmisión'}
            className={`relative w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center bg-gradient-to-b from-[#18181b] to-[#09090b] text-white border-2 border-[#FF2020] transition-all duration-200 active:scale-95 shadow-[0_0_24px_rgba(229,9,20,0.65)] hover:shadow-[0_0_32px_rgba(255,32,32,0.9)] group`}
          >
            {/* Inner subtle glow */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" />

            {isConnecting ? (
              <Loader2 size={32} className="animate-spin text-red-500" />
            ) : isPlaying ? (
              <Pause size={30} className="fill-white text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
            ) : (
              <Play size={32} className="fill-white text-white translate-x-0.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
            )}
          </button>
        </div>

        {/* Reconnect / Fast Refresh Button */}
        <button
          onClick={onReconnect}
          title="Refrescar transmisión en vivo"
          aria-label="Refrescar transmisión"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-transform active:scale-90"
        >
          <RotateCcw size={19} className="rotate-180" />
        </button>

        {/* Equalizer & Audio Config Button */}
        <button
          onClick={onOpenSettings}
          title="Ajustes de audio y emisora"
          aria-label="Ajustes de audio"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-transform active:scale-90"
        >
          <SlidersHorizontal size={19} />
        </button>
      </div>

      {/* Volume Bar and Indicator */}
      <div className="w-full flex items-center gap-3 px-1 pt-1">
        {/* Mute toggle icon */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
          aria-label="Silenciar o activar sonido"
          className="group min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-zinc-900 transition-colors"
        >
          {renderVolumeIcon()}
        </button>

        {/* Red Volume Range Slider with filled progress track */}
        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            aria-label="Control de volumen"
            className="w-full red-slider"
            style={{
              background: `linear-gradient(to right, #FF2020 ${effectiveVolPercent}%, #27272a ${effectiveVolPercent}%)`,
            }}
          />
        </div>

        {/* High Volume Icon */}
        <div className="min-w-[20px] flex items-center justify-center text-zinc-400">
          <Volume2 size={18} />
        </div>

        {/* VOL XX% Pill Badge */}
        <div className="px-2.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-[11px] font-mono font-bold text-zinc-200 tracking-wider select-none shrink-0">
          VOL {effectiveVolPercent}%
        </div>
      </div>
    </div>
  );
}
