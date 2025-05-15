import AuthService from './data/auth-service';

const publicVapidKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'; 

// Check if user is subscribed to push notifications
async function isSubscribed(registration) {
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}

// Initialize service worker only (no auto subscribe)
async function initializeNotifications() {
  try {
    console.log('Checking service worker support...');
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    console.log('Registering service worker...');
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready; // Wait for activation!
    console.log('Service Worker registered and ready:', registration);
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
}

async function subscribePushNotification(registration) {
  try {
    // Prevent duplicate subscriptions
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Already subscribed to push notifications.');
      return true;
    }

    // Request permission if needed
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied by user.');
        return false;
      }
    }

    console.log('Subscribing to push notifications...');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log('Push subscription successful:', subscription);

    // Transform subscription to match API requirements
    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.getKey('p256dh')
          ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh'))))
          : '',
        auth: subscription.getKey('auth')
          ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
          : ''
      }
    };

    // Send subscription to server
    console.log('Sending subscription to server...', payload);
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    console.log('Push notification subscription successful');
    return true;
  } catch (error) {
    console.error('Push notification subscription failed:', error);
    return false;
  }
}

// Unsubscribe from push notifications
async function unsubscribePushNotification(registration) {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const payload = {
        endpoint: subscription.endpoint
      };
      await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
        method: 'DELETE',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      await subscription.unsubscribe();
      console.log('Unsubscribed from push notifications.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    return false;
  }
}

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Initialize notifications when the page loads
window.addEventListener('load', () => {
  console.log('Page loaded, initializing notifications...');
  initializeNotifications();
});

export { initializeNotifications, unsubscribePushNotification, subscribePushNotification, isSubscribed }; 