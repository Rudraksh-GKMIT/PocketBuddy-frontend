// Minimal empty SW for PWA installability
self.addEventListener("install", () => {
  // Required to activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // Take control of all pages immediately
  self.clients.claim();
});

// Do NOT intercept fetch → no caching, no offline
