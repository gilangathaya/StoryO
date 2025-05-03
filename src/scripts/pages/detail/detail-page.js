import StoryAPI from '../../data/api';
import { showFormattedDate, sleep } from '../../utils';
import { showLoading, hideLoading } from '../../utils/loading-utils';
import CONFIG from '../../config';

export default class DetailPage {
  constructor(id) {
    this.id = id;
    this.story = null;
    this.map = null;
  }

  async render() {
    return `
      <section class="container">
        <a href="#/" class="btn btn-secondary" style="margin-bottom: 20px;">
          &larr; Kembali
        </a>
        <div id="story-detail">
          <p>Memuat data...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#fetchStoryDetail();
    this.#renderStoryDetail();
    if (this.story && this.story.lat && this.story.lon) {
      await sleep(300); // Wait for DOM to be ready
      this.#initMap();
    }
  }

  async #fetchStoryDetail() {
    try {
      showLoading();
      const response = await StoryAPI.getStoryDetail(this.id);
      hideLoading();
      
      if (response.error) {
        this.#showErrorMessage(response.message);
        return;
      }
      
      this.story = response.data;
    } catch (error) {
      hideLoading();
      this.#showErrorMessage('Gagal memuat detail cerita');
      console.error(error);
    }
  }

  #renderStoryDetail() {
    const storyDetailContainer = document.getElementById('story-detail');
    
    if (!this.story) {
      storyDetailContainer.innerHTML = '<p>Cerita tidak ditemukan</p>';
      return;
    }
    
    storyDetailContainer.innerHTML = `
      <article class="story-detail">
        <img class="story-detail-image" src="${this.story.photoUrl}" alt="Foto cerita dari ${this.story.name}">
        <div class="story-detail-content">
          <h1 class="story-detail-name">${this.story.name}</h1>
          <time class="story-detail-date" datetime="${this.story.createdAt}">
            ${showFormattedDate(this.story.createdAt, 'id-ID')}
          </time>
          <p class="story-detail-description">${this.story.description}</p>
          
          ${this.story.lat && this.story.lon ? `
            <div class="map-container">
              <h2>Lokasi</h2>
              <div id="map"></div>
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }

  #initMap() {
    if (!this.story || !this.story.lat || !this.story.lon) return;
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    try {
      // Create map
      const map = L.map('map').setView([this.story.lat, this.story.lon], 13);
      
      // Add tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      
      // Add marker
      const marker = L.marker([this.story.lat, this.story.lon]).addTo(map);
      
      // Add popup
      marker.bindPopup(`
        <strong>${this.story.name}</strong><br>
        <p>${this.story.description.substring(0, 100)}${this.story.description.length > 100 ? '...' : ''}</p>
      `).openPopup();
      
      this.map = map;
    } catch (error) {
      console.error('Error initializing map:', error);
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.innerHTML = '<p>Gagal memuat peta</p>';
      }
    }
  }

  #showErrorMessage(message) {
    const storyDetailContainer = document.getElementById('story-detail');
    storyDetailContainer.innerHTML = `<p class="error-message">Error: ${message}</p>`;
  }
}