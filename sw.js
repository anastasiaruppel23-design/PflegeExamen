const CACHE = 'pflegefokus-v58-study-heading-contrast';
const SUPABASE_SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './cloud-config.js', './account.js?v=3', './design.css?v=12',
  './assets/pflegefokus-willkommen.webp?v=2', './library.css?v=9',
  './disease-library.js?v=3', './library.js?v=14', './assets/atmung-schema.svg',
  './assets/haut-schema.svg', './glossary.js?v=12', './exam-practice.html',
  './practical-training.css?v=1', './practical-training.js?v=3', './model-application.js?v=2', './oral-guided.js?v=1', './exam-practice.js?v=18', './written-settings.js?v=1', './learning-upgrade.js?v=11', './anatomy-depth.js?v=1', './learning-expansion.js?v=9', './curriculum.js?v=1',
  './visual-library.js?v=25', './visual-library.css?v=13',
  './study-layout.css?v=3', './study-icons.js', './advanced-training.js', './exam-answers.js', './voice-answers.js?v=2',
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

