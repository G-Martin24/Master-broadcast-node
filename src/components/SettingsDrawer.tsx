import React, { useState } from 'react';
import {
  X,
  Radio,
  Image as ImageIcon,
  Share2,
  Clock,
  RotateCcw,
  Sparkles,
  Check,
  Calendar,
} from 'lucide-react';
import { StationConfig, IconType, RadioProgram } from '../types';
import { RockEmblem } from './RockIcons';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: StationConfig;
  onSaveConfig: (newConfig: StationConfig) => void;
  onResetDefaults: () => void;
  sleepTimerMinutes: number | null;
  onSetSleepTimer: (mins: number | null) => void;
  programs: RadioProgram[];
}

export function SettingsDrawer({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
  sleepTimerMinutes,
  onSetSleepTimer,
  programs,
}: SettingsDrawerProps) {
  const [activeTab, setActiveTab] = useState<'station' | 'artwork' | 'social' | 'schedule' | 'timer'>('station');
  const [form, setForm] = useState<StationConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync form when config changes or modal opens
  React.useEffect(() => {
    setForm(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const presetCovers = [
    {
      name: 'Rock & Metal Radio (Emblema Oficial)',
      url: '/src/assets/images/rock_metal_radio_logo_1792430917541.jpg',
      artist: 'Rock & Metal Radio',
      track: 'Radio Online • En Vivo',
      album: 'ROCK Y MAS ROCK 100%',
    },
    {
      name: 'Iron Empire Skull',
      url: '/src/assets/images/rock_metal_cover_1792428846792.jpg',
      artist: 'Bloodsteel',
      track: 'Iron Empire',
      album: 'REIGN OF FIRE (2024)',
    },
    {
      name: 'Master of Puppets Tribute',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      artist: 'Metallica',
      track: 'Master of Puppets',
      album: 'MASTER OF PUPPETS (1986)',
    },
    {
      name: 'Electric Guitar Flame',
      url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
      artist: 'Iron Maiden',
      track: 'The Trooper',
      album: 'PIECE OF MIND (1983)',
    },
    {
      name: 'Dark Stage Amplifiers',
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      artist: 'Black Sabbath',
      track: 'Paranoid',
      album: 'PARANOID (1970)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#0d0d10] border-l border-white/10 flex flex-col shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#121216]">
          <div className="flex items-center gap-2">
            <Radio className="text-[#E50914]" size={20} />
            <h3 className="font-rock text-base text-white tracking-wide uppercase">
              Configuración & Emisora
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#09090b] px-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('station')}
            className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'station'
                ? 'border-[#FF2020] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio size={14} />
            Emisora
          </button>
          <button
            onClick={() => setActiveTab('artwork')}
            className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'artwork'
                ? 'border-[#FF2020] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ImageIcon size={14} />
            Portada
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'social'
                ? 'border-[#FF2020] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Share2 size={14} />
            Redes
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'border-[#FF2020] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar size={14} />
            Shows
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'timer'
                ? 'border-[#FF2020] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock size={14} />
            Apagado
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'station' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre de la Radio
                </label>
                <input
                  type="text"
                  value={form.stationName}
                  onChange={(e) => setForm({ ...form, stationName: e.target.value })}
                  placeholder="ROCK & METAL RADIO"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Subtítulo de la Emisora
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="RADIO ONLINE"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  URL del Streaming de Audio (En Vivo)
                </label>
                <input
                  type="text"
                  value={form.streamUrl}
                  onChange={(e) => setForm({ ...form, streamUrl: e.target.value })}
                  placeholder="https://cesarradio.realserver.es/listen/rock_y_metal/radio.mp3"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Transmisión en vivo: Rock & Metal Radio (cesarradio.realserver.es)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Icono del Logo
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['badge', 'horns', 'skull', 'pick'] as IconType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, iconType: type })}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                        form.iconType === type
                          ? 'border-red-500 bg-red-950/30 shadow-[0_0_12px_rgba(229,9,20,0.3)]'
                          : 'border-white/5 bg-zinc-900/60 hover:border-white/20'
                      }`}
                    >
                      <RockEmblem type={type} size={32} />
                      <span className="text-[9px] font-medium text-zinc-300 capitalize truncate w-full text-center">
                        {type === 'badge' ? 'Emblema Mic' : type === 'horns' ? 'Mano Rock' : type === 'skull' ? 'Calavera' : 'Púa Rock'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Slogan Inferior
                </label>
                <input
                  type="text"
                  value={form.footerSlogan}
                  onChange={(e) => setForm({ ...form, footerSlogan: e.target.value })}
                  placeholder="SOLO ROCK • SOLO METAL • 24 HS"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#E50914] hover:bg-[#FF2020] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)] flex items-center justify-center gap-2"
              >
                {savedSuccess ? <Check size={18} /> : null}
                <span>{savedSuccess ? '¡Cambios Guardados!' : 'Guardar Emisora'}</span>
              </button>
            </form>
          )}

          {activeTab === 'artwork' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  URL de Portada Personalizada
                </label>
                <input
                  type="text"
                  value={form.coverUrl}
                  onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                  placeholder="https://ejemplo.com/portada.jpg"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Portadas Rock & Metal Predefinidas
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {presetCovers.map((preset) => (
                    <div
                      key={preset.name}
                      onClick={() => {
                        const updated = {
                          ...form,
                          coverUrl: preset.url,
                          currentArtist: preset.artist,
                          currentTrack: preset.track,
                          currentAlbum: preset.album,
                        };
                        setForm(updated);
                        onSaveConfig(updated);
                      }}
                      className={`group relative rounded-lg overflow-hidden border cursor-pointer transition-all ${
                        form.coverUrl === preset.url
                          ? 'border-red-500 ring-2 ring-red-500/50'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="aspect-square w-full bg-zinc-950 overflow-hidden">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-1.5 bg-zinc-900/90 text-left">
                        <p className="text-[10px] font-bold text-white truncate">{preset.artist}</p>
                        <p className="text-[9px] text-zinc-400 truncate">{preset.track}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Artista en pantalla
                </label>
                <input
                  type="text"
                  value={form.currentArtist}
                  onChange={(e) => setForm({ ...form, currentArtist: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none mb-2"
                />
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Canción / Show
                </label>
                <input
                  type="text"
                  value={form.currentTrack}
                  onChange={(e) => setForm({ ...form, currentTrack: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none mb-2"
                />
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Álbum / Edición
                </label>
                <input
                  type="text"
                  value={form.currentAlbum}
                  onChange={(e) => setForm({ ...form, currentAlbum: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onSaveConfig(form);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#E50914] hover:bg-[#FF2020] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)] flex items-center justify-center gap-2"
              >
                {savedSuccess ? <Check size={18} /> : null}
                <span>{savedSuccess ? '¡Portada Actualizada!' : 'Aplicar Portada'}</span>
              </button>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Personaliza los enlaces a tus redes sociales oficiales:
              </p>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Enlace de Instagram
                </label>
                <input
                  type="text"
                  value={form.socialLinks.instagram}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, instagram: e.target.value },
                    })
                  }
                  placeholder="https://www.instagram.com/rockmetal_onlineradio/"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Enlace de Facebook
                </label>
                <input
                  type="text"
                  value={form.socialLinks.facebook}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, facebook: e.target.value },
                    })
                  }
                  placeholder="https://www.facebook.com/RockAndMetalRadioOnline?locale=es_LA"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Enlace de WhatsApp
                </label>
                <input
                  type="text"
                  value={form.socialLinks.whatsapp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, whatsapp: e.target.value },
                    })
                  }
                  placeholder="https://wa.me/5493764561004?text=Hola%2C%20quiero%20escuchar%20la%20radio"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Enlace de YouTube
                </label>
                <input
                  type="text"
                  value={form.socialLinks.youtube}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, youtube: e.target.value },
                    })
                  }
                  placeholder="https://youtube.com/@rockmetalradio"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onSaveConfig(form);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#E50914] hover:bg-[#FF2020] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)] flex items-center justify-center gap-2"
              >
                {savedSuccess ? <Check size={18} /> : null}
                <span>{savedSuccess ? '¡Redes Guardadas!' : 'Guardar Enlaces'}</span>
              </button>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                  Grilla de Programación
                </span>
                <span className="text-[10px] text-red-400 font-mono">24 HORAS EN VIVO</span>
              </div>

              <div className="space-y-2">
                {programs.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border transition-all ${
                      item.isLiveNow
                        ? 'bg-red-950/40 border-red-500/70 shadow-[0_0_15px_rgba(229,9,20,0.2)]'
                        : 'bg-zinc-900/60 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-red-400">
                        {item.time}
                      </span>
                      {item.isLiveNow && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E50914] text-white">
                          AL AIRE
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                      <span>Conduce: {item.host}</span>
                      <span className="text-zinc-500">{item.genre}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timer' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Programa el apagado automático de la radio si escuchas antes de dormir:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onSetSleepTimer(mins)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      sleepTimerMinutes === mins
                        ? 'bg-red-950/50 border-red-500 text-white shadow-[0_0_10px_rgba(229,9,20,0.4)]'
                        : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <span className="block text-lg font-bold font-mono">{mins}</span>
                    <span className="text-[10px] text-zinc-400 uppercase">Minutos</span>
                  </button>
                ))}
              </div>

              {sleepTimerMinutes !== null && (
                <button
                  type="button"
                  onClick={() => onSetSleepTimer(null)}
                  className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                >
                  Cancelar temporizador de apagado
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer with Reset Defaults */}
        <div className="p-4 border-t border-white/10 bg-[#121216] flex items-center justify-between">
          <button
            type="button"
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw size={14} />
            <span>Restablecer valores</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
