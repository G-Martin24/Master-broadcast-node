/**
 * Rock & Metal Radio - Service Worker
 * Designed for offline shell caching, PWA compliance, and PWABuilder APK packaging.
 */

const CACHE_NAME = 'rock-metal-radio-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/logo-rock-metal.jpg',
  '/logo-rock-metal.svg',
];

// Install: Pre-cache app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Handle network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass cache completely for live audio streaming & dynamic radio metadata
  if (
    url.pathname.includes('/listen/') ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.aac') ||
    url.hostname.includes('realserver.es') ||
    url.pathname.includes('/api/station-metadata') ||
    url.pathname.includes('/api/nowplaying')
  ) {
    return; // Standard network fetch
  }

  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Navigation / Shell / Static asset caching strategy: Stale-While-Revalidate or Network-First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
