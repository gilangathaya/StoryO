import { getRoute } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { applyViewTransition } from '../utils/view-transition';

class App {
  #content = null;
  #navigationDrawer = null;
  #drawerButton = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#navigationDrawer = navigationDrawer;
    this.#drawerButton = drawerButton;
    this.#content = content;

    this.#setupNavigation();
    this.#setupHashChange();
    this.#setupSkipLink();
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

  #setupSkipLink() {
    const mainContent = document.querySelector('#main-content');
    const skipLink = document.querySelector('.skip-link');

    skipLink.addEventListener('click', function (event) {
      event.preventDefault(); // Mencegah refresh halaman
      skipLink.blur(); // Menghilangkan fokus skip to content
      mainContent.focus(); // Fokus ke konten utama
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Halaman scroll ke konten utama
    });
  }

  async renderPage() {
    try {
      const url = getActiveRoute();
      console.log('Current URL:', url);
      const page = getRoute(url);
      console.log('Resolved page:', page);

      if (!page) {
        console.log('No page found, might be redirected to login');
        return;
      }

      // Cleanup previous page if it exists
      if (this.#currentPage && typeof this.#currentPage.cleanup === 'function') {
        console.log('Cleaning up previous page');
        this.#currentPage.cleanup();
      }

      // Use View Transitions API if available
      await applyViewTransition(async () => {
        try {
          console.log('Rendering page content');
          this.#content.innerHTML = await page.render();
          console.log('Page rendered, calling afterRender');
          await page.afterRender();
          this.#currentPage = page;
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