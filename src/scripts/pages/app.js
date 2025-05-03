import routes from '../routes/routes';
import { getActiveRoute, parseActivePathname } from '../routes/url-parser';
import { applyViewTransition } from '../utils/view-transitions';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  async renderPage() {
    try {
      const url = getActiveRoute();
      const urlSegments = parseActivePathname();
      
      let page;
      
      // Check if the route has a parameter
      if (url.includes(':id') && urlSegments.id) {
        const routeFunction = routes[url];
        if (typeof routeFunction === 'function') {
          page = routeFunction(urlSegments.id);
        } else {
          // Fallback to home if route function is not found
          page = routes['/'];
        }
      } else {
        page = routes[url] || routes['/'];
      }

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