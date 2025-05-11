import BaseView from './base-view';

class StoryView extends BaseView {
  constructor() {
    super();
    this.storyList = document.getElementById('storyList');
    this.storyDetail = document.getElementById('storyDetail');
    this.maps = new Map(); // Store map instances
    console.log('StoryView initialized');
  }

  bindMapMarkerClick(callback) {
    this.onMapMarkerClick = callback;
  }

  displayStories(stories) {
    if (!stories || stories.length === 0) {
      this.storyList.innerHTML = '<p>No stories available</p>';
      return;
    }

    this.storyList.innerHTML = stories.map(story => `
      <div class="story-card" data-id="${story.id}">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <div class="map-container">
          <div class="map" id="map-${story.id}"></div>
        </div>
      </div>
    `).join('');

    // Initialize maps for each story
    stories.forEach(story => {
      if (story.lat && story.lon) {
        this.initMap(story.id, story.lat, story.lon);
      }
    });
  }

  initMap(storyId, lat, lon) {
    const mapElement = document.getElementById(`map-${storyId}`);
    if (!mapElement) return;

    // Destroy previous map instance if exists
    if (mapElement._leaflet_id) {
      mapElement._leaflet_id = null;
      mapElement.innerHTML = '';
    }

    // Force height in case CSS is not applied
    mapElement.style.height = '300px';

    const map = L.map(mapElement).setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>Lokasi</b><br>Lat: ${lat}<br>Lon: ${lon}`);
    marker.on('click', () => this.onMapMarkerClick(storyId));

    this.maps.set(storyId, { map, marker });
  }

  displayStoryDetail(story) {
    if (!story) {
      this.storyDetail.innerHTML = '<p>Story not found</p>';
      return;
    }
    
    this.storyDetail.innerHTML = `
      <h2>${story.name}</h2>
      <p>${story.description}</p>
      <div class="map-container">
        <div class="map" id="map-detail"></div>
      </div>
    `;

    if (story.lat && story.lon) {
      this.initMap('detail', story.lat, story.lon);
    }
  }

  showError(message) {
    const errorMessage = `<div class="error-message">${message}</div>`;
    this.storyList.innerHTML = errorMessage;
    this.storyDetail.innerHTML = errorMessage;
  }

  render() {
    return `
      <div id="storyList"></div>
      <div id="storyDetail"></div>
    `;
  }
}

export default StoryView; 