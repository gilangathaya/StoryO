// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  const data = event.data.json();
  console.log('Push data:', data);
  
  const options = {
    body: data.body,
    icon: '/images/icons/icon-72x72.png',
    badge: '/images/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'Lihat Cerita',
        icon: '/images/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/images/icons/xmark.png'
      }
    ]
  };

  console.log('Showing notification with options:', options);
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click event:', event);
  event.notification.close();

  if (event.action === 'explore') {
    console.log('Opening URL:', event.notification.data.url);
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('story-app-v1').then(function(cache) {
      console.log('Service Worker cache opened');
      return cache.addAll([
        '/',
        '/index.html',
        '/images/icons/icon-72x72.png',
        '/images/icons/badge-72x72.png'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== 'story-app-v1') {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 