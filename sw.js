const CACHE = 'pflegefokus-v43-account-access';
const SUPABASE_SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './cloud-config.js', './account.js?v=1', './design.css?v=10',
  './assets/pflegefokus-willkommen.webp?v=2', './library.css?v=9',
  './disease-library.js?v=3', './library.js?v=12', './assets/atmung-schema.svg',
  './assets/haut-schema.svg', './glossary.js?v=11', './exam-practice.html',
  './exam-practice.js?v=9', './learning-upgrade.js?v=7', './learning-expansion.js?v=2',
  './visual-library.js?v=21', './visual-library.css?v=13',
  './assets/anastasia-pflege-illustration.svg', './assets/heart-study.webp',
  './assets/lung-study.webp', './assets/glucose-study.webp'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
    try {
      const response = await fetch(SUPABASE_SDK, {signal: AbortSignal.timeout(8000)});
      if (response.ok) await cache.put(SUPABASE_SDK, response);
    } catch {
      // The local app can install even if the auth library is temporarily unreachable.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE && key.startsWith('pflegefokus-v'))
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET'
      || (new URL(request.url).origin !== self.location.origin && request.url !== SUPABASE_SDK)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (response.ok) event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await cache.match('./index.html')) || Response.error();
      }
      return Response.error();
    }
  })());
});
