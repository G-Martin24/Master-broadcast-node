import React from 'react';
import { Menu, Timer } from 'lucide-react';
import { RockEmblem } from './RockIcons';
import { IconType } from '../types';

interface RockHeaderProps {
  stationName: string;
  subtitle: string;
  iconType: IconType;
  onOpenMenu: () => void;
  sleepTimerSeconds: number | null;
}

export function RockHeader({
  stationName,
  subtitle,
  iconType,
  onOpenMenu,
  sleepTimerSeconds,
}: RockHeaderProps) {
  // Format station title into rock metal style (highlighting & or second word in red if applicable)
  const renderFormattedTitle = (title: string) => {
    if (title.toUpperCase().includes('OKTUBRE')) {
      const parts = title.split(/FM/i);
      return (
        <>
          <span className="text-metallic font-black">OKTUBRE</span>{' '}
          <span className="text-[#0070D2] font-black text-glow-blue tracking-wider">FM</span>
        </>
      );
    }
    if (title.includes('&')) {
      const parts = title.split('&');
      return (
        <>
          <span className="text-metallic">{parts[0].trim()}</span>{' '}
          <span className="text-[#FF2020] text-glow-red font-black">&</span>{' '}
          <span className="text-metallic">{parts.slice(1).join('&').trim()}</span>
        </>
      );
    }
    return <span className="text-metallic">{title}</span>;
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="relative w-full flex items-center justify-between py-2 px-3 border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md z-20">
      {/* Left Slot: Rock Emblem Icon */}
      <div className="flex items-center gap-2.5">
        <div className="relative group cursor-pointer transition-transform duration-200 active:scale-95" onClick={onOpenMenu}>
          <div className="absolute -inset-1 rounded-full bg-[#E50914] opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
          <RockEmblem type={iconType} size={42} className="relative drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]" />
        </div>

        {/* Center-Left: Station Branding Title and Subtitle */}
        <div className="flex flex-col">
          <h1 className="font-rock text-lg md:text-xl font-black uppercase tracking-wider leading-none select-none">
            {renderFormattedTitle(stationName)}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-[1.5px] w-4 bg-[#FF2020] shadow-[0_0_4px_#FF2020]" />
            <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-zinc-300">
              {subtitle}
            </span>
            <span className="h-[1.5px] w-4 bg-[#FF2020] shadow-[0_0_4px_#FF2020]" />
          </div>
        </div>
      </div>

      {/* Right Slot: Sleep Timer Badge (if active) + Menu Button */}
      <div className="flex items-center gap-2">
        {sleepTimerSeconds !== null && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-red-500/30 text-[10px] text-red-400 font-mono">
            <Timer size={12} className="text-red-500 animate-pulse" />
            <span>{formatTimer(sleepTimerSeconds)}</span>
          </div>
        )}

        <button
          onClick={onOpenMenu}
          aria-label="Abrir menú y configuración"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors active:scale-95"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
