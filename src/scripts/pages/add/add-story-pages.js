// src/scripts/pages/add/add-story-page.js
import StoryAPI from '../../data/api';
import { showLoading, hideLoading } from '../../utils/loading-utils';
import CONFIG from '../../config';
import { sleep } from '../../utils';

export default class AddStoryPage {
  constructor() {
    this.stream = null;
    this.photo = null;
    this.latitude = null;
    this.longitude = null;
    this.map = null;
    this.marker = null;
  }

  async render() {
    return `
      <section class="container">
        <div class="form-container">
          <h1 class="form-title">Tambah Cerita Baru</h1>
          
          <form id="add-story-form">
            <div class="form-group">
              <label for="story-name" class="form-label">Nama</label>
              <input type="text" id="story-name" class="form-input" required placeholder="Masukkan nama Anda">
            </div>
            
            <div class="form-group">
              <label for="story-description" class="form-label">Cerita</label>
              <textarea id="story-description" class="form-textarea" required placeholder="Tulis cerita Anda di sini..."></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Foto</label>
              <div class="camera-container">
                <div class="camera-preview">
                  <video id="camera-view" autoplay playsinline></video>
                  <img id="captured-image" alt="Hasil foto" style="display: none;">
                </div>
                <div class="camera-controls">
                  <button type="button" id="camera-start" class="btn btn-secondary">Mulai Kamera</button>
                  <button type="button" id="capture-button" class="btn btn-primary" disabled>Ambil Foto</button>
                  <button type="button" id="recapture-button" class="btn btn-secondary" style="display:none">Ambil Ulang</button>
                </div>
              </div>
            </div>
            
            <div class="form-group location-container">
              <label class="location-label">Lokasi</label>
              <p>Klik pada peta untuk menandai lokasi cerita Anda:</p>
              <div id="location-map"></div>
              <div class="location-coordinates" id="location-coordinates">
                Belum ada lokasi yang dipilih
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary">Kirim Cerita</button>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Initialize map
    await sleep(300); // Wait for DOM to be ready
    this.#initMap();
    
    // Setup event listeners
    this.#setupCameraEvents();
    this.#setupFormSubmission();
  }

  #initMap() {
    try {
      const mapContainer = document.getElementById('location-map');
      if (!mapContainer) return;
      
      // Create map with default view of Indonesia
      this.map = L.map('location-map').setView([-2.5489, 118.0149], 5);
      
      // Add tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      
      // Setup click event on map
      this.map.on('click', (e) => {
        this.#handleMapClick(e);
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      const mapContainer = document.getElementById('location-map');
      if (mapContainer) {
        mapContainer.innerHTML = '<p>Gagal memuat peta</p>';
      }
    }
  }

  #handleMapClick(e) {
    // Get latitude and longitude from clicked position
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;
    
    // Update coordinates display
    const coordinatesDisplay = document.getElementById('location-coordinates');
    coordinatesDisplay.textContent = `Latitude: ${this.latitude.toFixed(6)}, Longitude: ${this.longitude.toFixed(6)}`;
    
    // Add or update marker
    if (this.marker) {
      this.marker.setLatLng(e.latlng);
    } else {
      this.marker = L.marker(e.latlng).addTo(this.map);
    }
  }

  #setupCameraEvents() {
    const cameraView = document.getElementById('camera-view');
    const capturedImage = document.getElementById('captured-image');
    const cameraStartButton = document.getElementById('camera-start');
    const captureButton = document.getElementById('capture-button');
    const recaptureButton = document.getElementById('recapture-button');
    
    // Start camera button
    cameraStartButton.addEventListener('click', async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        
        cameraView.srcObject = this.stream;
        cameraView.style.display = 'block';
        capturedImage.style.display = 'none';
        captureButton.disabled = false;
        cameraStartButton.disabled = true;
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Gagal mengakses kamera. Pastikan kamera tersedia dan izin diberikan.');
      }
    });
    
    // Capture photo button
    captureButton.addEventListener('click', () => {
      // Create a canvas element to capture current video frame
      const canvas = document.createElement('canvas');
      canvas.width = cameraView.videoWidth;
      canvas.height = cameraView.videoHeight;
      const context = canvas.getContext('2d');
      
      // Draw the current video frame to canvas
      context.drawImage(cameraView, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob for upload
      canvas.toBlob((blob) => {
        this.photo = blob;
        
        // Display captured image
        capturedImage.src = URL.createObjectURL(blob);
        capturedImage.style.display = 'block';
        cameraView.style.display = 'none';
        
        // Update button states
        captureButton.style.display = 'none';
        recaptureButton.style.display = 'inline-block';
        
        // Stop the camera stream
        this.#stopCameraStream();
      }, 'image/jpeg', 0.8);
    });
    
    // Recapture button
    recaptureButton.addEventListener('click', async () => {
      capturedImage.style.display = 'none';
      recaptureButton.style.display = 'none';
      cameraStartButton.disabled = false;
      captureButton.style.display = 'inline-block';
      this.photo = null;
    });
  }

  #stopCameraStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.stream = null;
    }
  }

  #setupFormSubmission() {
    const form = document.getElementById('add-story-form');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.getElementById('story-name').value;
      const description = document.getElementById('story-description').value;
      
      // Validate inputs
      if (!name || !description) {
        alert('Mohon isi nama dan deskripsi cerita.');
        return;
      }
      
      if (!this.photo) {
        alert('Mohon ambil foto untuk cerita Anda.');
        return;
      }
      
      try {
        showLoading();
        
        // Prepare story data
        const storyData = {
          description: `${name}: ${description}`,
          photo: this.photo,
        };
        
        // Add location if available
        if (this.latitude && this.longitude) {
          storyData.lat = this.latitude;
          storyData.lon = this.longitude;
        }
        
        // Submit to API
        const response = await StoryAPI.addStory(storyData);
        hideLoading();
        
        if (response.error) {
          alert(`Gagal menambahkan cerita: ${response.message}`);
          return;
        }
        
        // Show success message and redirect to home
        alert('Cerita berhasil ditambahkan!');
        window.location.hash = '#/';
        
      } catch (error) {
        hideLoading();
        console.error('Error adding story:', error);
        alert('Terjadi kesalahan saat menambahkan cerita. Silakan coba lagi.');
      } finally {
        // Clean up resources
        this.#stopCameraStream();
        if (this.map) {
          this.map.remove();
          this.map = null;
        }
      }
    });
  }
}