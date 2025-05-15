// src/scripts/index.js
import '../styles/styles.css';
import App from './pages/app';
import AuthService from './data/auth-service';
import loadEnvironmentVariables from './utils/env-loader';
import { initializeNotifications, unsubscribePushNotification, subscribePushNotification, isSubscribed } from './notification';

// Load environment variables
loadEnvironmentVariables();

// Initialize the app
const app = new App({
  navigationDrawer: document.getElementById('navigation-drawer'),
  drawerButton: document.getElementById('drawer-button'),
  content: document.getElementById('main-content'),
});

// Notification button logic
async function updateNotificationButton() {
  const notificationLink = document.getElementById('notification-toggle-link');
  const notificationButton = document.getElementById('notification-toggle-button');
  const notificationText = notificationButton?.querySelector('.notification-text');

  if (!AuthService.isLoggedIn()) {
    notificationLink.style.display = 'none';
    return;
  }

  notificationLink.style.display = 'block';

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscribed = await isSubscribed(registration);
    if (subscribed) {
      notificationText.textContent = 'Nonaktifkan Notifikasi';
      notificationButton.classList.add('subscribed');
    } else {
      notificationText.textContent = 'Aktifkan Notifikasi';
      notificationButton.classList.remove('subscribed');
    }
  }
}

document.getElementById('notification-toggle-button')?.addEventListener('click', async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscribed = await isSubscribed(registration);
    const notificationText = document.getElementById('notification-toggle-button').querySelector('.notification-text');
    if (subscribed) {
      await unsubscribePushNotification(registration);
      notificationText.textContent = 'Aktifkan Notifikasi';
      document.getElementById('notification-toggle-button').classList.remove('subscribed');
    } else {
      const permission = Notification.permission === 'granted' || (await Notification.requestPermission()) === 'granted';
      if (permission) {
        await subscribePushNotification(registration);
        notificationText.textContent = 'Nonaktifkan Notifikasi';
        document.getElementById('notification-toggle-button').classList.add('subscribed');
      } else {
        alert('Izinkan notifikasi di browser untuk mengaktifkan fitur ini.');
      }
    }
  }
});

// Initialize push notifications when user logs in
function updateAuthUI() {
  const isLoggedIn = AuthService.isLoggedIn();
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');

  if (isLoggedIn) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutLink.style.display = 'inline';
    // Initialize notifications when user logs in
    initializeNotifications();
    updateNotificationButton();
  } else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    logoutLink.style.display = 'none';
    updateNotificationButton();
  }
}

// Setup logout handler
document.getElementById('logout-link')?.addEventListener('click', async (e) => {
  e.preventDefault();
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await unsubscribePushNotification(registration);
  }
  AuthService.logout();
  updateAuthUI();
  window.location.hash = '#/';
});

// Render the initial page and update auth UI
window.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  app.renderPage();
});

// Update auth UI on hash changes
window.addEventListener('hashchange', updateAuthUI);

// Export utility functions (keeping the original exports)
export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}