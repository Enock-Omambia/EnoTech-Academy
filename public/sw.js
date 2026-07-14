const CACHE_NAME = "enotech-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg"
];

// Install event - pre-cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Stale-While-Revalidate caching strategy
// It serves from cache immediately for speed/offline use, then updates cache from network in background
self.addEventListener("fetch", (event) => {
  // Only handle HTTP/HTTPS (skip chrome-extension, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip POST, PUT, DELETE requests (only cache GET)
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fallback: Fetch a fresh version in the background to keep cache hot
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Quietly catch background fetch failures (e.g. offline)
          });
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache the response
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((err) => {
        console.log("[Service Worker] Fetch failed, resource offline:", event.request.url);
        // If it's a page navigation, return the cached index.html
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
        throw err;
      });
    })
  );
});
