import { getRoute } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { applyViewTransition } from '../utils/view-transition';

class App {
  #content = null;
  #navigationDrawer = null;
  #drawerButton = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#navigationDrawer = navigationDrawer;
    this.#drawerButton = drawerButton;
    this.#content = content;

    this.#setupNavigation();
    this.#setupHashChange();
  }

  #setupNavigation() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && 
          !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }
    });
  }

  #setupHashChange() {
    window.addEventListener('hashchange', () => {
      this.renderPage();
    });
  }

  async renderPage() {
    try {
      const url = getActiveRoute();
      const page = getRoute(url);

      if (!page) return; // Route was redirected to login

      // Use View Transitions API if available
      await applyViewTransition(async () => {
        try {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
        } catch (error) {
          console.error('Error rendering page:', error);
          this.#content.innerHTML = `<div class="container">
            <div class="error-message">Error loading page: ${error.message}</div>
          </div>`;
        }
      });
    } catch (error) {
      console.error('Error in renderPage:', error);
      this.#content.innerHTML = `<div class="container">
        <div class="error-message">Application error: ${error.message}</div>
      </div>`;
    }
  }
}

export default App;