// Cache name is stamped at BUILD time by the sw-version plugin in vite.config.ts.
// It must change on every deploy: the activate handler purges every cache whose
// name differs from the current one, so a constant name (the old
// 'dog-planner-v1') meant nothing was EVER purged and stale assets could be
// served indefinitely once they were in the cache.
const CACHE_NAME = 'dog-planner-__SW_VERSION__';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(['/']))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      // Take over open tabs immediately rather than waiting for every tab to
      // close, so a deploy reaches users on their next navigation.
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  // Never serve a cached HTML document: that is what pins a user to an old
  // bundle after a deploy. Network only, with cache as a pure offline fallback.
  const isDocument = req.mode === 'navigate' || req.destination === 'document';

  event.respondWith(
    fetch(req)
      .then(response => {
        if (response && response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return response;
      })
      .catch(() => caches.match(req).then(hit => hit || (isDocument ? caches.match('/') : undefined)))
  );
});
