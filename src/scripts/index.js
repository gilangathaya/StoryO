// src/scripts/index.js
import '../styles/styles.css';
import App from './pages/app';
import AuthService from './data/auth-service';
import loadEnvironmentVariables from './utils/env-loader';
import { initializeNotifications, unsubscribePushNotification } from './notification';

// Load environment variables
loadEnvironmentVariables();

// Initialize the app
const app = new App({
  navigationDrawer: document.getElementById('navigation-drawer'),
  drawerButton: document.getElementById('drawer-button'),
  content: document.getElementById('main-content'),
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
  } else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    logoutLink.style.display = 'none';
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