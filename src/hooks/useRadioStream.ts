import { useState, useEffect, useRef, useCallback } from 'react';
import { StreamStatus } from '../types';

interface UseRadioStreamProps {
  initialStreamUrl: string;
  onTrackChange?: () => void;
}

export function useRadioStream({ initialStreamUrl }: UseRadioStreamProps) {
  const [streamUrl, setStreamUrl] = useState<string>(initialStreamUrl);
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('rock_radio_volume');
    return saved !== null ? Math.max(0, Math.min(1, parseFloat(saved))) : 0.75;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // in seconds
  const [isAnalyserActive, setIsAnalyserActive] = useState<boolean>(false);

  // Audio references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const hasTriedCorsRef = useRef<boolean>(true);

  // Frequency data container for 32 equalizer bars
  const frequenciesRef = useRef<Uint8Array>(new Uint8Array(32));

  // Update volume
  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
    localStorage.setItem('rock_radio_volume', clamped.toString());
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  }, []);

  // Initialize or connect Web Audio API safely
  const setupWebAudio = useCallback(() => {
    if (!audioRef.current) return;
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        audioContextRef.current = new AudioContextClass();
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }

      if (!analyserRef.current && audioContextRef.current) {
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 64; // Gives 32 frequency bins
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        if (!sourceNodeRef.current && audioRef.current) {
          try {
            const source = audioContextRef.current.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(audioContextRef.current.destination);
            sourceNodeRef.current = source;
            setIsAnalyserActive(true);
          } catch (err) {
            // If cross-origin or already connected
            console.warn('Web Audio source connection warning:', err);
          }
        }
      }
    } catch (e) {
      console.warn('AudioContext initialization note:', e);
    }
  }, []);

  // Main Play Action
  const play = useCallback(async () => {
    if (!audioRef.current) return;
    setErrorMessage(null);
    setStatus('connecting');

    setupWebAudio();

    try {
      // If audio source is empty or changed, update it
      if (!audioRef.current.src || audioRef.current.src !== streamUrl) {
        audioRef.current.src = streamUrl;
        audioRef.current.load();
      }
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        setStatus('playing');
      }
    } catch (err: unknown) {
      console.warn('Playback start error:', err);
      // If CORS prevented playback, retry without crossOrigin
      if (hasTriedCorsRef.current && audioRef.current) {
        hasTriedCorsRef.current = false;
        audioRef.current.removeAttribute('crossorigin');
        audioRef.current.src = streamUrl + (streamUrl.includes('?') ? '&' : '?') + 'nocors=' + Date.now();
        try {
          await audioRef.current.play();
          setStatus('playing');
          return;
        } catch (innerErr) {
          console.error('Fallback playback failed:', innerErr);
        }
      }
      setStatus('error');
      setErrorMessage('No se pudo conectar a la transmisión en vivo. Intenta reiniciar la conexión.');
    }
  }, [streamUrl, setupWebAudio]);

  // Main Pause Action
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus('paused');
    }
  }, []);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (status === 'playing' || status === 'connecting') {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  // Reconnect stream / Refresh buffer
  const reconnect = useCallback(() => {
    if (!audioRef.current) return;
    setStatus('connecting');
    setErrorMessage(null);
    const freshUrl = streamUrl.split('?')[0] + '?t=' + Date.now();
    audioRef.current.src = freshUrl;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => {
        setStatus('playing');
      })
      .catch((err) => {
        console.warn('Reconnect error:', err);
        setStatus('error');
        setErrorMessage('Error al reconectar el streaming.');
      });
  }, [streamUrl]);

  // Change Stream URL
  const changeStreamUrl = useCallback((newUrl: string) => {
    setStreamUrl(newUrl);
    if (audioRef.current) {
      const wasPlaying = status === 'playing';
      audioRef.current.src = newUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play()
          .then(() => setStatus('playing'))
          .catch(() => setStatus('error'));
      } else {
        setStatus('idle');
      }
    }
  }, [status]);

  // Sleep timer ticker
  useEffect(() => {
    if (sleepTimer === null || sleepTimer <= 0) return;
    const interval = setInterval(() => {
      setSleepTimer((prev) => {
        if (prev === null || prev <= 1) {
          pause();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepTimer, pause]);

  // Audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    const handlePlaying = () => {
      setStatus('playing');
      setErrorMessage(null);
    };

    const handleWaiting = () => {
      if (status !== 'paused' && status !== 'idle') {
        setStatus('connecting');
      }
    };

    const handlePause = () => {
      if (status !== 'error') {
        setStatus('paused');
      }
    };

    const handleError = () => {
      setStatus('error');
      setErrorMessage('Error al reproducir el flujo de audio.');
    };

    const handleCanPlay = () => {
      if (status === 'connecting') {
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [volume, isMuted, status]);

  // Set Sleep Timer in minutes
  const setSleepTimerMinutes = useCallback((minutes: number | null) => {
    if (minutes === null) {
      setSleepTimer(null);
    } else {
      setSleepTimer(minutes * 60);
    }
  }, []);

  return {
    audioRef,
    analyserRef,
    frequenciesRef,
    status,
    isPlaying: status === 'playing',
    volume,
    isMuted,
    errorMessage,
    sleepTimer,
    streamUrl,
    isAnalyserActive,
    play,
    pause,
    togglePlay,
    reconnect,
    setVolume,
    toggleMute,
    changeStreamUrl,
    setSleepTimerMinutes,
  };
}
