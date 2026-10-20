/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Wifi,
  WifiOff,
  Flame,
  Volume2,
  Calendar,
  Sparkles,
  Smartphone,
  Monitor,
  Headphones,
  Sliders,
  ExternalLink,
  Music,
} from 'lucide-react';
import { StationConfig, RadioProgram } from './types';
import { useRadioStream } from './hooks/useRadioStream';
import { RockHeader } from './components/RockHeader';
import { CoverArtCard } from './components/CoverArtCard';
import { PlayerControls } from './components/PlayerControls';
import { EqualizerVisualizer } from './components/EqualizerVisualizer';
import { MetallicBanner, SocialButtons, FooterKicker } from './components/FooterSection';
import { SettingsDrawer } from './components/SettingsDrawer';
import { useLiveMetadata } from './hooks/useLiveMetadata';
import { LiveMetadataModal } from './components/LiveMetadataModal';

const DEFAULT_STREAM_URL = 'https://cesarradio.realserver.es/listen/rock_y_metal/radio.mp3';
const DEFAULT_COVER = '/src/assets/images/rock_metal_radio_logo_1792430917541.jpg';

const DEFAULT_CONFIG: StationConfig = {
  stationName: 'ROCK & METAL',
  subtitle: 'RADIO ONLINE',
  streamUrl: DEFAULT_STREAM_URL,
  coverUrl: DEFAULT_COVER,
  currentArtist: 'Rock & Metal Radio',
  currentTrack: 'Radio Online • En Vivo',
  currentAlbum: 'ROCK Y MAS ROCK 100%',
  footerSlogan: 'ROCK & METAL • RADIO ONLINE • 24 HS',
  iconType: 'badge',
  socialLinks: {
    facebook: 'https://www.facebook.com/RockAndMetalRadioOnline?locale=es_LA',
    instagram: 'https://www.instagram.com/rockmetal_onlineradio/',
    whatsapp: 'https://wa.me/5493764561004?text=Hola%2C%20quiero%20escuchar%20la%20radio',
    youtube: 'https://youtube.com',
  },
};

const SAMPLE_SHOWS: RadioProgram[] = [
  {
    time: '07:00 - 10:00',
    title: 'Despertar Rockero',
    host: 'César Radio',
    genre: 'Heavy Metal & Hard Rock',
  },
  {
    time: '10:00 - 14:00',
    title: 'Rock & Metal Non-Stop',
    host: 'Estudio Central',
    genre: 'Rock y más Rock 100%',
    isLiveNow: true,
  },
  {
    time: '14:00 - 18:00',
    title: 'Rotación General',
    host: 'DJ Rock',
    genre: 'Thrash, Doom, Gothic & Power Metal',
  },
  {
    time: '18:00 - 22:00',
    title: 'Bandas Europa & Estrenos',
    host: 'Especiales',
    genre: 'Novedades Internacionales',
  },
  {
    time: '22:00 - 07:00',
    title: 'Madrugada de Riffs',
    host: 'AutoDJ Liquidsoap',
    genre: '24 Horas de Puro Metal',
  },
];

const TRACK_DEMOS = [
  {
    artist: 'Rock & Metal Radio',
    track: 'Radio Online • En Vivo',
    album: 'ROCK Y MAS ROCK 100%',
    cover: '/src/assets/images/rock_metal_radio_logo_1792430917541.jpg',
  },
  {
    artist: 'Metallica',
    track: 'Master of Puppets',
    album: 'MASTER OF PUPPETS (1986)',
    cover: '/src/assets/images/rock_metal_cover_1792428846792.jpg',
  },
  {
    artist: 'Iron Maiden',
    track: 'The Trooper',
    album: 'PIECE OF MIND (1983)',
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
  },
  {
    artist: 'Megadeth',
    track: 'Holy Wars... The Punishment Due',
    album: 'RUST IN PEACE (1990)',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  },
  {
    artist: 'Judas Priest',
    track: 'Painkiller',
    album: 'PAINKILLER (1990)',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  },
];

export default function App() {
  // Load configuration from localStorage
  const [config, setConfig] = useState<StationConfig>(() => {
    try {
      const saved = localStorage.getItem('rock_metal_radio_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.stationName === 'Oktubre FM' ||
          parsed.coverUrl?.includes('oktubre') ||
          parsed.iconType === 'oktubre' ||
          !parsed.coverUrl
        ) {
          localStorage.setItem('rock_metal_radio_config', JSON.stringify(DEFAULT_CONFIG));
          return DEFAULT_CONFIG;
        }
        if (parsed.streamUrl?.includes('streamtheworld') || !parsed.streamUrl) {
          parsed.streamUrl = DEFAULT_STREAM_URL;
        }

        // Migrate social links if they were generic placeholders
        const socialLinks = {
          ...DEFAULT_CONFIG.socialLinks,
          ...parsed.socialLinks,
        };
        if (
          !parsed.socialLinks?.instagram ||
          parsed.socialLinks.instagram === 'https://instagram.com' ||
          parsed.socialLinks.instagram.includes('instagram.com/rockmetalradio')
        ) {
          socialLinks.instagram = DEFAULT_CONFIG.socialLinks.instagram;
        }
        if (
          !parsed.socialLinks?.facebook ||
          parsed.socialLinks.facebook === 'https://facebook.com' ||
          parsed.socialLinks.facebook.includes('facebook.com/rockmetalradio')
        ) {
          socialLinks.facebook = DEFAULT_CONFIG.socialLinks.facebook;
        }
        if (
          !parsed.socialLinks?.whatsapp ||
          parsed.socialLinks.whatsapp === 'https://wa.me/' ||
          parsed.socialLinks.whatsapp.includes('5491123456789')
        ) {
          socialLinks.whatsapp = DEFAULT_CONFIG.socialLinks.whatsapp;
        }

        const merged = { ...DEFAULT_CONFIG, ...parsed, socialLinks, streamUrl: DEFAULT_STREAM_URL };
        localStorage.setItem('rock_metal_radio_config', JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn('Error reading stored config:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [desktopViewMode, setDesktopViewMode] = useState<'mobile-frame' | 'studio-desk'>('mobile-frame');

  // Real-time metadata from https://cesarradio.realserver.es/public/rock_y_metal
  const {
    metadata,
    isLoading: isMetadataLoading,
    currentElapsed,
    refresh: refreshMetadata,
  } = useLiveMetadata();

  const liveSong = metadata?.now_playing?.song;
  const activeArtist = liveSong?.artist || config.currentArtist;
  const activeTrack = liveSong?.title || config.currentTrack;
  const activeAlbum = liveSong?.album
    ? `${liveSong.album}`
    : liveSong?.genre
    ? `${liveSong.genre}`
    : config.currentAlbum;
  const activeCover = liveSong?.art || config.coverUrl;
  const activeStationName = metadata?.station?.name || config.stationName;
  const listenersCount = metadata?.listeners?.total;

  // Initialize Radio Stream Hook
  const {
    audioRef,
    analyserRef,
    status,
    volume,
    isMuted,
    errorMessage,
    sleepTimer,
    streamUrl,
    togglePlay,
    reconnect,
    setVolume,
    toggleMute,
    changeStreamUrl,
    setSleepTimerMinutes,
  } = useRadioStream({
    initialStreamUrl: config.streamUrl || DEFAULT_STREAM_URL,
  });

  // Keep stream URL in sync with config
  useEffect(() => {
    if (config.streamUrl && config.streamUrl !== streamUrl) {
      changeStreamUrl(config.streamUrl);
    }
  }, [config.streamUrl, streamUrl, changeStreamUrl]);

  const handleSaveConfig = (newConfig: StationConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('rock_metal_radio_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Error saving config to localStorage:', e);
    }
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem('rock_metal_radio_config');
    } catch (e) {
      console.warn('Error clearing config:', e);
    }
    changeStreamUrl(DEFAULT_STREAM_URL);
  };

  const handleNextDemoTrack = () => {
    const nextIdx = (demoIndex + 1) % TRACK_DEMOS.length;
    setDemoIndex(nextIdx);
    const demo = TRACK_DEMOS[nextIdx];
    const updated: StationConfig = {
      ...config,
      currentArtist: demo.artist,
      currentTrack: demo.track,
      currentAlbum: demo.album,
      coverUrl: demo.cover,
    };
    handleSaveConfig(updated);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] bg-textured-dark flex flex-col justify-between text-zinc-100 select-none overflow-x-hidden">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        preload="none"
        crossOrigin="anonymous"
        aria-hidden="true"
        className="hidden"
      />

      {/* Top Desktop Helper Bar (visible on md/lg screens) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2.5 bg-[#0a0a0c]/90 border-b border-white/5 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-red-500 font-bold uppercase tracking-wider">
            <Radio size={14} className="animate-pulse" />
            <span>Master Broadcast Node</span>
          </div>
          <span className="text-zinc-600">|</span>
          <span className="font-mono text-zinc-400 text-[11px] truncate max-w-xs">
            {config.streamUrl}
          </span>
        </div>

        {/* View mode toggle on large screens */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setDesktopViewMode('mobile-frame')}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                desktopViewMode === 'mobile-frame'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone size={13} />
              <span>Chasis Móvil</span>
            </button>
            <button
              onClick={() => setDesktopViewMode('studio-desk')}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                desktopViewMode === 'studio-desk'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor size={13} />
              <span>Consola Studio</span>
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Sliders size={13} />
            <span>Ajustes</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center p-2 sm:p-4 lg:p-6">
        {/* Layout Mode A: Mobile Phone Mockup Frame (Faithful to Reference Image) */}
        {desktopViewMode === 'mobile-frame' ? (
          <div className="w-full flex items-center justify-center">
            {/* The Phone Bezel Container */}
            <div className="relative w-full max-w-[420px] rounded-[38px] p-2 sm:p-3 bg-gradient-to-b from-[#2a2a2e] via-[#151518] to-[#0d0d10] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_20px_rgba(229,9,20,0.15)] border-2 border-zinc-700/60 transition-all duration-300">
              {/* Outer Phone Ring Highlights */}
              <div className="absolute inset-0 rounded-[36px] pointer-events-none border border-white/10" />

              {/* Speaker & Camera Notch Bar */}
              <div className="w-full flex items-center justify-between px-6 pt-1 pb-2">
                <span className="text-[11px] font-mono font-bold text-zinc-400">10:24</span>
                {/* Speaker pill */}
                <div className="w-16 h-1.5 rounded-full bg-zinc-800 border border-white/5" />
                <div className="flex items-center gap-1 text-zinc-400 text-[10px]">
                  <Wifi size={12} className={status === 'playing' ? 'text-red-500' : ''} />
                  <span>82%</span>
                </div>
              </div>

              {/* Inner Screen Surface */}
              <div className="relative w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-[#09090b] via-[#0c0c0f] to-[#050507] border border-white/5 flex flex-col justify-between p-3.5 shadow-inner">
                {/* Ambient Red Glow Backlight in background */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header with rock emblem & title */}
                <RockHeader
                  stationName={config.stationName}
                  subtitle={config.subtitle}
                  iconType={config.iconType}
                  onOpenMenu={() => setIsMenuOpen(true)}
                  sleepTimerSeconds={sleepTimer}
                />

                {/* Center Main Cover Card */}
                <div className="mt-2">
                  <CoverArtCard
                    coverUrl={activeCover}
                    artist={activeArtist}
                    track={activeTrack}
                    album={activeAlbum}
                    status={status}
                    stationName={activeStationName}
                    listenersCount={listenersCount}
                    onOpenMetadata={() => setIsMetadataModalOpen(true)}
                    onNextTrackPreset={handleNextDemoTrack}
                  />
                </div>

                {/* Main Player Controls: Play/Pause, Volume Slider */}
                <div className="mt-1">
                  <PlayerControls
                    status={status}
                    volume={volume}
                    isMuted={isMuted}
                    errorMessage={errorMessage}
                    onTogglePlay={togglePlay}
                    onReconnect={reconnect}
                    onVolumeChange={setVolume}
                    onToggleMute={toggleMute}
                    onOpenPlaylist={() => setIsMetadataModalOpen(true)}
                    onOpenSettings={() => setIsMenuOpen(true)}
                  />
                </div>

                {/* Animated Equalizer Visualizer */}
                <div className="mt-1">
                  <EqualizerVisualizer
                    analyserNode={analyserRef.current}
                    status={status}
                    volume={volume}
                    isMuted={isMuted}
                    barCount={13}
                  />
                </div>

                {/* Secondary Metallic Banner */}
                <div className="mt-2">
                  <MetallicBanner
                    stationName={activeStationName}
                    subtitle={config.subtitle}
                  />
                </div>

                {/* Social Buttons */}
                <div className="mt-1">
                  <SocialButtons links={config.socialLinks} />
                </div>

                {/* Slogan Footer Kicker */}
                <div className="mt-1">
                  <FooterKicker text={config.footerSlogan} />
                </div>

                {/* Virtual Phone Bottom Android/iOS Navigation Bar */}
                <div className="w-full flex items-center justify-around pt-2 text-zinc-500 text-xs">
                  <span className="font-mono text-sm tracking-widest">|||</span>
                  <div className="w-3.5 h-3.5 rounded-sm border border-zinc-600" />
                  <span className="font-mono text-sm">&lt;</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Layout Mode B: Expanded Studio Desk View for Desktop */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Player Console */}
            <div className="lg:col-span-5 w-full bg-metal-panel rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              <RockHeader
                stationName={config.stationName}
                subtitle={config.subtitle}
                iconType={config.iconType}
                onOpenMenu={() => setIsMenuOpen(true)}
                sleepTimerSeconds={sleepTimer}
              />

              <div className="mt-4">
                <CoverArtCard
                  coverUrl={activeCover}
                  artist={activeArtist}
                  track={activeTrack}
                  album={activeAlbum}
                  status={status}
                  stationName={activeStationName}
                  listenersCount={listenersCount}
                  onOpenMetadata={() => setIsMetadataModalOpen(true)}
                  onNextTrackPreset={handleNextDemoTrack}
                />
              </div>

              <div className="mt-3">
                <PlayerControls
                  status={status}
                  volume={volume}
                  isMuted={isMuted}
                  errorMessage={errorMessage}
                  onTogglePlay={togglePlay}
                  onReconnect={reconnect}
                  onVolumeChange={setVolume}
                  onToggleMute={toggleMute}
                  onOpenPlaylist={() => setIsMetadataModalOpen(true)}
                  onOpenSettings={() => setIsMenuOpen(true)}
                />
              </div>

              <div className="mt-3">
                <EqualizerVisualizer
                  analyserNode={analyserRef.current}
                  status={status}
                  volume={volume}
                  isMuted={isMuted}
                  barCount={13}
                />
              </div>

              <div className="mt-3">
                <MetallicBanner
                  stationName={activeStationName}
                  subtitle={config.subtitle}
                />
              </div>

              <div className="mt-2">
                <SocialButtons links={config.socialLinks} />
              </div>

              <div className="mt-2">
                <FooterKicker text={config.footerSlogan} />
              </div>
            </div>

            {/* Right Column: Studio Broadcast Dashboard & Program Lineup */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Live Broadcast Status Banner */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="font-rock text-base text-white uppercase tracking-wider">
                      Estudio Principal En Vivo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Transmisión en alta fidelidad 128 kbps STEREO • Bitrate dinámico adaptativo
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-zinc-400 block uppercase">Estado de señal</span>
                    <span className="text-xs font-bold text-emerald-400">99.8% ÓPTIMA</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-red-500">
                    <Headphones size={22} />
                  </div>
                </div>
              </div>

              {/* Live Track Metadata Card (AzuraCast realtime) */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-[#121218] border border-red-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-rock text-sm text-zinc-200 uppercase tracking-wide flex items-center gap-2">
                    <Music size={16} className="text-red-500" />
                    Sonando en Directo (Metadatos de la Estación)
                  </span>
                  <button
                    onClick={() => setIsMetadataModalOpen(true)}
                    className="text-xs text-red-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-zinc-800 border border-white/10 hover:border-red-500/40"
                  >
                    <span>Ver historial & detalle</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-zinc-950 shrink-0 shadow-lg">
                    <img
                      src={activeCover}
                      alt={activeTrack}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = config.coverUrl;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-rock text-base text-white font-bold truncate leading-snug">
                      {activeTrack}
                    </p>
                    <p className="text-sm font-semibold text-red-400 truncate">
                      {activeArtist}
                    </p>
                    <p className="text-xs text-zinc-400 truncate font-mono mt-0.5">
                      {activeAlbum}
                    </p>
                  </div>
                  {listenersCount !== undefined && (
                    <div className="text-right shrink-0 px-3 py-1.5 rounded-xl bg-zinc-950/70 border border-white/5">
                      <span className="text-[10px] text-zinc-400 uppercase block font-mono">Oyentes</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">{listenersCount}</span>
                    </div>
                  )}
                </div>

                {metadata?.playing_next?.song && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-zinc-500">Próximo tema:</span>
                    <span className="font-semibold text-zinc-300 truncate ml-2">
                      {metadata.playing_next.song.artist} - {metadata.playing_next.song.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Studio Master EQ & Spectral Meter */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-rock text-sm text-zinc-200 uppercase tracking-wide flex items-center gap-2">
                    <Flame size={16} className="text-red-500" />
                    Master Visualizer Estéreo (L / R)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {status === 'playing' ? 'ANALIZANDO FRECUENCIAS' : 'EN ESPERA'}
                  </span>
                </div>

                <EqualizerVisualizer
                  analyserNode={analyserRef.current}
                  status={status}
                  volume={volume}
                  isMuted={isMuted}
                  barCount={48}
                />
              </div>

              {/* Show Schedule Today */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                  <span className="font-rock text-sm text-zinc-200 uppercase tracking-wide flex items-center gap-2">
                    <Calendar size={16} className="text-red-500" />
                    Programación Oficial de Hoy
                  </span>
                  <span className="text-[11px] font-mono text-red-400 font-bold">24 HORAS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SAMPLE_SHOWS.map((show, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border transition-all ${
                        show.isLiveNow
                          ? 'bg-red-950/40 border-red-500/70 shadow-[0_0_15px_rgba(229,9,20,0.2)]'
                          : 'bg-zinc-950/40 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-red-400">{show.time}</span>
                        {show.isLiveNow && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E50914] text-white">
                            AL AIRE
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white truncate">{show.title}</p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {show.host} • <span className="text-zinc-500">{show.genre}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Settings & Configuration Modal Drawer */}
      <SettingsDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetDefaults={handleResetDefaults}
        sleepTimerMinutes={sleepTimer !== null ? Math.ceil(sleepTimer / 60) : null}
        onSetSleepTimer={setSleepTimerMinutes}
        programs={SAMPLE_SHOWS}
      />

      {/* Live Metadata Modal */}
      <LiveMetadataModal
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        metadata={metadata}
        isLoading={isMetadataLoading}
        currentElapsed={currentElapsed}
        onRefresh={refreshMetadata}
      />
    </div>
  );
}
