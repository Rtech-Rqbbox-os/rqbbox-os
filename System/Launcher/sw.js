// RQBBOX OS — Service Worker (offline PWA support)
const CACHE = 'rqbbox-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/animations.css',
  '/js/app.js',
  '/js/boot.js',
  '/js/api.js',
  '/js/data.js',
  '/js/utils.js',
  '/js/stats.js',
  '/js/runtime.js',
  '/js/audio.js',
  '/js/editions.js',
  '/js/pluginLoader.js',
  '/js/qrcode.js',
  '/js/setup.js',
  '/js/pages/home.js',
  '/js/pages/games.js',
  '/js/pages/apps.js',
  '/js/pages/store.js',
  '/js/pages/files.js',
  '/js/pages/ai.js',
  '/js/pages/settings.js',
  '/js/pages/profile.js',
  '/js/pages/downloads.js',
  '/js/pages/media.js',
  '/js/pages/browser.js',
  '/js/pages/friends.js',
  '/branding/rqbbox-logo.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => new Response('Offline', { status: 503 })))
  );
});
