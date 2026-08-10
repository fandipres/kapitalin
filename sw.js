const CACHE_NAME = 'kapitalin-cache-v3';
const urlsToCache = [
    './',
    './index.html',
    './dictionary.html',
    './about.html',
    './manifest.json',
    './assets/css/app.css',
    './assets/js/data.js',
    './assets/js/capitalize.js',
    './assets/js/index.js',
    './assets/js/dictionary.js',
    './assets/js/pwa.js',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/icons/favicon-32.png',
    './assets/icons/og-image.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Membuka cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheAllowlist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});