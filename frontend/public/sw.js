// service-worker.ts
// Define a cache name
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',               // Cache the root page
  '/index.html',     // Cache the main HTML file
  '/src/styles.css', // Update path to the main CSS file
  '/src/script.js',  // Update path to the main JavaScript entry point
  '/manifest.json',  // Cache the app manifest
  '/favicon.ico',    // Cache the favicon
  '/enlightened.png',
  '/src/assets/5490419-hd_1920_1080_25fps.mp4',
  '/src/assets/HabituraCropLogo.png',
  '/offline.html'
  // Add other essential files here (images, fonts, etc.)
];
// Install event: Cache specified URLs
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});
// Activate event: Clean up old caches if necessary
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', cache);
            return caches.delete(cache); // Delete old cache
          }
        })
      );
    })
  );
});

// Fetch event: Serve requests from cache or fetch from network
// self.addEventListener('fetch', (event) => {
//   console.log('Service Worker: Fetching', event.request.url);
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // If a cached response is found, return it; otherwise, fetch from network
//       return (
//         response ||
//         fetch(event.request).then(async (response) => {
//           const cache = await caches.open(CACHE_NAME);
//           cache.put(event.request, response.clone()); // Cache the new response
//           return response;
//         })
//       );
//     })
//   );
// });

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cache
        if (response) {
          return response;
        }
        // Cache miss - fetch from the network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response
            const responseToCache = response.clone();
            // Open the cache and put the fetched response in it
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        ).catch((error) => {
          console.error('Fetch failed; returning offline page instead.', error);
          // You can return a fallback page here if needed
          return caches.match('/offline.html');
        });
      }).catch((error) => {
        console.error('Error in fetch handler:', error);
        return new Response('Service Unavailable', { status: 503 });
      })
  );
});

// Handle periodic sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'sync-failed-requests') {
    event.waitUntil(processSyncQueue());
  }
});

// Handle service worker updates
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});