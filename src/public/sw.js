// Service Worker for Push Notifications
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('story-app-v1').then(function(cache) {
      console.log('Service Worker cache opened');
      return cache.addAll([
        '/',
        '/index.html'
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

self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  const data = event.data.json();
  console.log('Push data:', data);
  
  const options = {
    body: data.body,
    icon: '',
    badge: '',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Story',
        icon: ''
      },
      {
        action: 'close',
        title: 'Close',
        icon: ''
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

  // Always open '/'
  const urlToOpen = '/';

  if (event.action === 'explore') {
    console.log('Opening URL:', urlToOpen);
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
}); 