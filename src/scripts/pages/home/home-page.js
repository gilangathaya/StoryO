// src/scripts/pages/home/home-page.js
import StoryAPI from '../../data/api';
import { showFormattedDate, sleep } from '../../utils'; // Properly import sleep
import { showLoading, hideLoading } from '../../utils/loading-utils';
import L from 'leaflet';

export default class HomePage {
  constructor() {
    this.stories = [];
    this.map = null;
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
    
    storiesContainer.innerHTML = this.stories.map((story, idx) => {
      const dateTime = new Date(story.createdAt).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return `
        <article class="story-item" data-id="${story.id}">
          <div class="story-image-container">
            <img class="story-image" src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" loading="lazy">
          </div>
          <div class="story-content">
            <h2 class="story-name">${story.name}</h2>
            ${story.lat && story.lon ? `
              <div class="story-card-location-text">
                <small>Lokasi: ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}</small>
              </div>
            ` : ''}
            <p class="story-description">${story.description}</p>
            <time class="story-date" datetime="${story.createdAt}">
              ${dateTime}
            </time>
            ${story.lat && story.lon ? `
              <div class="story-card-map-container">
                <div id="story-card-map-${idx}" class="story-card-map"></div>
              </div>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Initialize maps for each story card with location
    this.stories.forEach((story, idx) => {
      if (story.lat && story.lon) {
        setTimeout(() => {
          const map = L.map(`story-card-map-${idx}`, {
            attributionControl: false,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            tap: false,
          }).setView([story.lat, story.lon], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          L.marker([story.lat, story.lon]).addTo(map);
        }, 0);
      }
    });
  }

  #initEventListeners() {
    // Remove all click and keyboard event listeners to disable card navigation
  }

  #showErrorMessage(message) {
    const storiesContainer = document.getElementById('stories');
    storiesContainer.innerHTML = `<p class="error-message">Error: ${message}</p>`;
  }
}