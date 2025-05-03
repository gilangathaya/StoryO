import StoryAPI from '../../data/api';
import { showFormattedDate } from '../../utils';
import { showLoading, hideLoading } from '../../utils/loading-utils';

export default class HomePage {
  constructor() {
    this.stories = [];
  }

  async render() {
    return `
      <section class="container">
        <h1>Cerita Terbaru</h1>
        <div id="stories" class="story-list">
          <p>Memuat data...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#fetchStories();
    this.#renderStories();
    this.#initEventListeners();
  }

  async #fetchStories() {
    try {
      showLoading();
      const response = await StoryAPI.getStories();
      hideLoading();
      
      if (response.error) {
        this.#showErrorMessage(response.message);
        return;
      }
      
      this.stories = response.data;
    } catch (error) {
      hideLoading();
      this.#showErrorMessage('Gagal memuat data cerita');
      console.error(error);
    }
  }

  #renderStories() {
    const storiesContainer = document.getElementById('stories');
    
    if (this.stories.length === 0) {
      storiesContainer.innerHTML = '<p>Tidak ada cerita yang tersedia</p>';
      return;
    }
    
    storiesContainer.innerHTML = this.stories.map((story) => `
      <article class="story-item" data-id="${story.id}">
        <div class="story-image-container">
          <img class="story-image" src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" loading="lazy">
        </div>
        <div class="story-content">
          <h2 class="story-name">${story.name}</h2>
          <p class="story-description">${story.description}</p>
          <time class="story-date" datetime="${story.createdAt}">
            ${showFormattedDate(story.createdAt, 'id-ID')}
          </time>
        </div>
      </article>
    `).join('');
  }

  #initEventListeners() {
    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        const storyId = event.currentTarget.dataset.id;
        window.location.hash = `#/detail/${storyId}`;
      });
      
      // Make entire card keyboard accessible
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const storyId = event.currentTarget.dataset.id;
          window.location.hash = `#/detail/${storyId}`;
        }
      });
      
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'link');
      item.setAttribute('aria-label', `Lihat detail cerita dari ${item.querySelector('.story-name').textContent}`);
    });
  }

  #showErrorMessage(message) {
    const storiesContainer = document.getElementById('stories');
    storiesContainer.innerHTML = `<p class="error-message">Error: ${message}</p>`;
  }
}