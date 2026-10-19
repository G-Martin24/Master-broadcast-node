import React from 'react';
import { SocialIcon } from './RockIcons';
import { SocialLinks as SocialLinksType } from '../types';

interface MetallicBannerProps {
  stationName: string;
  subtitle: string;
}

export function MetallicBanner({ stationName, subtitle }: MetallicBannerProps) {
  return (
    <div className="w-full relative py-2.5 px-4 my-1 overflow-hidden rounded-lg bg-gradient-to-r from-[#0d0d0f] via-[#1a1a1f] to-[#0d0d0f] border-y border-red-900/60 shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
      {/* Corner metallic rivets */}
      <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400 shadow-sm" />
      <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400 shadow-sm" />
      <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400 shadow-sm" />
      <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400 shadow-sm" />

      {/* Flanking glowing red laser lines */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent to-[#FF2020] shadow-[0_0_6px_#FF2020]" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-l from-transparent to-[#FF2020] shadow-[0_0_6px_#FF2020]" />

      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-rock text-base md:text-lg font-black tracking-widest text-metallic uppercase drop-shadow">
          {stationName}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-6 h-[1.5px] bg-[#FF2020]" />
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-zinc-300 uppercase">
            {subtitle}
          </span>
          <span className="w-6 h-[1.5px] bg-[#FF2020]" />
        </div>
      </div>
    </div>
  );
}

interface SocialButtonsProps {
  links: SocialLinksType;
}

export function SocialButtons({ links }: SocialButtonsProps) {
  const items = [
    {
      name: 'Facebook',
      url: links.facebook,
      platform: 'facebook' as const,
      bg: 'bg-[#1877F2]',
      shadow: 'hover:shadow-[0_0_15px_rgba(24,119,242,0.6)]',
    },
    {
      name: 'Instagram',
      url: links.instagram,
      platform: 'instagram' as const,
      bg: 'bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584]',
      shadow: 'hover:shadow-[0_0_15px_rgba(225,48,108,0.6)]',
    },
    {
      name: 'WhatsApp',
      url: links.whatsapp,
      platform: 'whatsapp' as const,
      bg: 'bg-[#25D366]',
      shadow: 'hover:shadow-[0_0_15px_rgba(37,211,102,0.6)]',
    },
    {
      name: 'YouTube',
      url: links.youtube,
      platform: 'youtube' as const,
      bg: 'bg-[#FF0000]',
      shadow: 'hover:shadow-[0_0_15px_rgba(255,0,0,0.6)]',
    },
  ];

  return (
    <div className="w-full grid grid-cols-4 gap-2 py-2">
      {items.map((item) => (
        <a
          key={item.name}
          href={item.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 group cursor-pointer transition-transform duration-150 active:scale-95"
        >
          {/* Circular Icon Container */}
          <div
            className={`w-12 h-12 rounded-full ${item.bg} ${item.shadow} flex items-center justify-center text-white shadow-md transition-all duration-200 group-hover:scale-105`}
          >
            <SocialIcon platform={item.platform} size={22} />
          </div>

          {/* Social Name Label */}
          <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white transition-colors truncate">
            {item.name}
          </span>
        </a>
      ))}
    </div>
  );
}

export function FooterKicker({ text }: { text: string }) {
  return (
    <div className="w-full flex items-center justify-center gap-2.5 pt-2 pb-1 border-t border-white/5 select-none">
      {/* Red Laser Accent Left */}
      <div className="flex-1 max-w-[40px] h-[1.5px] bg-gradient-to-r from-transparent to-[#FF2020] shadow-[0_0_4px_#FF2020]" />

      {/* Center Soundwave Icon & Slogan */}
      <div className="flex items-center gap-1.5 text-zinc-400">
        <svg width="18" height="12" viewBox="0 0 24 14" fill="none" className="text-[#FF2020]">
          <path
            d="M1 7H4L7 1L11 13L15 4L18 9H23"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[10px] md:text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          {text}
        </span>
      </div>

      {/* Red Laser Accent Right */}
      <div className="flex-1 max-w-[40px] h-[1.5px] bg-gradient-to-l from-transparent to-[#FF2020] shadow-[0_0_4px_#FF2020]" />
    </div>
  );
}
