// CSS imports
import '../styles/styles.css';

// JS imports
import App from './pages/app';
import loadEnvironmentVariables from './utils/env-loader';

// Load environment variables
loadEnvironmentVariables();

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});