self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('space-hookah').then(cache => {
            return cache.addAll(['./', './css/style.css', './js/app.js']);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});