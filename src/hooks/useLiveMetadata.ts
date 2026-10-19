import { useState, useEffect, useCallback, useRef } from 'react';
import { RadioMetadataResponse } from '../types/metadata';

export function useLiveMetadata() {
  const [metadata, setMetadata] = useState<RadioMetadataResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentElapsed, setCurrentElapsed] = useState<number>(0);

  const timerRef = useRef<number | null>(null);

  const fetchMetadata = useCallback(async () => {
    try {
      let data: RadioMetadataResponse | null = null;

      // 1. Try local server proxy endpoint
      try {
        const res = await fetch('/api/station-metadata', { cache: 'no-store' });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await res.json();
          }
        }
      } catch (proxyErr) {
        console.warn('Proxy fetch warning, trying direct:', proxyErr);
      }

      // 2. If proxy didn't return data, try direct AzuraCast API
      if (!data) {
        const directRes = await fetch('https://cesarradio.realserver.es/api/nowplaying/rock_y_metal', {
          cache: 'no-store',
        });
        if (directRes.ok) {
          data = await directRes.json();
        }
      }

      if (data && data.now_playing?.song) {
        setMetadata(data);
        setCurrentElapsed(data.now_playing.elapsed || 0);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err: unknown) {
      console.warn('Metadata fetch error:', err);
      setError('No se pudieron actualizar los metadatos en vivo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll metadata every 6 seconds
  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 6000);
    return () => clearInterval(interval);
  }, [fetchMetadata]);

  // Tick elapsed time smoothly every second
  useEffect(() => {
    if (!metadata?.now_playing) return;
    const interval = setInterval(() => {
      setCurrentElapsed((prev) => {
        const total = metadata.now_playing.duration || 300;
        if (prev >= total) return prev;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [metadata]);

  return {
    metadata,
    isLoading,
    error,
    lastUpdated,
    currentElapsed,
    refresh: fetchMetadata,
  };
}
