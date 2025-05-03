// src/scripts/pages/home/home-page.js
import StoryAPI from '../../data/api';
import { showFormattedDate } from '../../utils';
import { showLoading, hideLoading } from '../../utils/loading-utils';

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
        <div class="map-container">
          <h2>Peta Lokasi Cerita</h2>
          <div id="stories-map"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#fetchStories();
    this.#renderStories();
    this.#initEventListeners();
    await sleep(300); // Wait for DOM to be ready
    this.#initMap();
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

  #initMap() {
    try {
      const mapContainer = document.getElementById('stories-map');
      if (!mapContainer) return;
      
      // Create map with default view of Indonesia
      this.map = L.map('stories-map').setView([-2.5489, 118.0149], 4);
      
      // Add tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      
      // Add markers for stories with location
      this.#addStoryMarkers();
    } catch (error) {
      console.error('Error initializing map:', error);
      const mapContainer = document.getElementById('stories-map');
      if (mapContainer) {
        mapContainer.innerHTML = '<p>Gagal memuat peta</p>';
      }
    }
  }

  #addStoryMarkers() {
    if (!this.map || !this.stories.length) return;
    
    // Create a bounds object to fit all markers
    const bounds = L.latLngBounds();
    let hasMarkers = false;
    
    this.stories.forEach(story => {
      if (story.lat && story.lon) {
        // Create marker
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        
        // Add popup with story info
        marker.bindPopup(`
          <div class="popup-content">
            <h3>${story.name}</h3>
            <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" style="width:100%;max-height:150px;object-fit:cover;margin-bottom:8px;">
            <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
            <a href="#/detail/${story.id}" class="popup-link">Lihat Detail</a>
          </div>
        `);
        
        // Extend bounds
        bounds.extend([story.lat, story.lon]);
        hasMarkers = true;
      }
    });
    
    // Fit map to show all markers if any exist
    if (hasMarkers) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
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
          ${story.lat && story.lon ? `
            <p class="story-location">
              <small>Lokasi: ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}</small>
            </p>
          ` : ''}
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

// Helper function for sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}