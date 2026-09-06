/* Minimal offline cache for Secret Identity PWA */
const CACHE_NAME = "secret-identity-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./viewport.js",
  "./settings.js",
  "./settings-module.js",
  "./characters.js",
  "./character-module.js",
  "./character-specify-module.js",
  "./character-edit-module.js",
  "./round-module.js",
  "./score-module.js",
  "./winner-module.js",
  "./new-game-module.js",
  "./manifest.webmanifest",
  "./assets/favicon/favicon.ico",
  "./assets/favicon/favicon-16x16.png",
  "./assets/favicon/favicon-32x32.png",
  "./assets/favicon/apple-touch-icon.png",
  "./assets/favicon/android-chrome-192x192.png",
  "./assets/favicon/android-chrome-512x512.png",
  "./assets/bg.png",
  "./assets/all-keys.PNG",
  "./assets/keys/gold.png",
  "./assets/keys/green.png",
  "./assets/keys/red.png",
  "./assets/keys/pink.png",
  "./assets/keys/grey.png",
  "./assets/keys/yellow.png",
  "./assets/keys/white.png",
  "./assets/keys/purple.png",
  "./assets/keys/light-blue.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          if (response && response.ok && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
