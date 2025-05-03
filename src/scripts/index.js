// src/scripts/index.js
import '../styles/styles.css';
import App from './pages/app';
import loadEnvironmentVariables from './utils/env-loader';

// Load environment variables
loadEnvironmentVariables();

// Initialize the app
const app = new App({
  navigationDrawer: document.getElementById('navigation-drawer'),
  drawerButton: document.getElementById('drawer-button'),
  content: document.getElementById('main-content'),
});

// Render the initial page
window.addEventListener('DOMContentLoaded', () => {
  app.renderPage();
});

// Handle hash change events for navigation
window.addEventListener('hashchange', () => {
  app.renderPage();
});

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