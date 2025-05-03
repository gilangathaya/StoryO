import StoryAPI from '../../data/api';
import { showFormattedDate, sleep } from '../../utils';
import { showLoading, hideLoading } from '../../utils/loading-utils';
import CONFIG from '../../config';

export default class DetailPage {
  constructor(id) {
    this.id = id;
    this.story = null;
    this.map = null;
    this.marker = null;
  }

  async render() {
    return `
      <section class="container">
        <div class="story-detail-container">
          <div id="story-detail-content">
            <h1 class="story-detail-title">Memuat cerita...</h1>
            <div class="story-detail-image-container">
              <img class="story-detail-image" src="" alt="Story image">
            </div>
            <p class="story-detail-description"></p>
            <p class="story-detail-date"></p>
          </div>
          
          <div class="map-container">
            <div id="story-map"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#fetchStory();
    this.#setupMap();
  }

  async #fetchStory() {
    try {
      const response = await StoryAPI.getStoryDetail(this.id);
      
      if (response.error) {
        this.#showErrorMessage(response.message);
        return;
      }
      
      this.story = response.data;
      this.#updateStoryUI();
    } catch (error) {
      this.#showErrorMessage('Gagal memuat detail cerita');
      console.error(error);
    }
  }

  #updateStoryUI() {
    const titleElement = document.querySelector('.story-detail-title');
    const imageElement = document.querySelector('.story-detail-image');
    const descriptionElement = document.querySelector('.story-detail-description');
    const dateElement = document.querySelector('.story-detail-date');

    titleElement.textContent = this.story.name;
    imageElement.src = this.story.photoUrl;
    imageElement.alt = `Foto cerita ${this.story.name}`;
    descriptionElement.textContent = this.story.description;
    dateElement.textContent = new Date(this.story.createdAt).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  #setupMap() {
    if (!this.story || !this.story.lat || !this.story.lon) {
      document.querySelector('.map-container').style.display = 'none';
      return;
    }

    this.map = L.map('story-map').setView([this.story.lat, this.story.lon], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([this.story.lat, this.story.lon])
      .addTo(this.map)
      .bindPopup(this.story.name)
      .openPopup();
  }

  #showErrorMessage(message) {
    const contentElement = document.getElementById('story-detail-content');
    contentElement.innerHTML = `
      <div class="error-message">
        <h2>${message}</h2>
        <p>Silakan kembali ke <a href="#/">halaman utama</a></p>
      </div>
    `;
  }
}