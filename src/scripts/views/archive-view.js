import BaseView from './base-view';

class ArchiveView extends BaseView {
  constructor() {
    super();
  }

  render() {
    return `
      <section class="container">
        <h1>Cerita Tersimpan</h1>
        <div id="archived-stories" class="story-list">
          <p>Memuat data...</p>
        </div>
      </section>
    `;
  }

  showArchivedStories(stories) {
    const storiesContainer = document.getElementById('archived-stories');
    
    if (!stories || stories.length === 0) {
      storiesContainer.innerHTML = '<p>Belum ada cerita yang diarsipkan</p>';
      return;
    }
    
    storiesContainer.innerHTML = stories.map((story, idx) => {
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
            <button class="remove-archive-button" data-id="${story.id}">
              Hapus dari Arsip
            </button>
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
    stories.forEach((story, idx) => {
      if (story.lat && story.lon) {
        setTimeout(() => {
          const map = L.map(`story-card-map-${idx}`, {
            attributionControl: false,
            zoomControl: true,
            dragging: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            tap: true,
          }).setView([story.lat, story.lon], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`<b>Lokasi</b><br>Lat: ${story.lat.toFixed(6)}<br>Lon: ${story.lon.toFixed(6)}`);
          
          marker.on('click', () => {
            marker.openPopup();
          });
        }, 0);
      }
    });

    // Add click event listeners to remove archive buttons
    document.querySelectorAll('.remove-archive-button').forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const storyId = button.getAttribute('data-id');
        this.onRemoveArchive(storyId);
      });
    });
  }

  bindRemoveArchive(callback) {
    this.onRemoveArchive = callback;
  }
}

export default ArchiveView; 