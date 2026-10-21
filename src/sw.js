// Retire legacy broad caches: never replay yesterday's daily API response.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) if (key.startsWith('pantry-')) await caches.delete(key);
  await self.clients.claim();
  await self.registration.unregister();
})()));
