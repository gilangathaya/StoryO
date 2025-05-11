import BaseView from './base-view';

class AddStoryView extends BaseView {
  constructor() {
    super();
    this.stream = null;
    this.photo = null;
    this.latitude = null;
    this.longitude = null;
    this.map = null;
    this.marker = null;
  }

  render() {
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

  bindCameraStart(callback) {
    const cameraStartButton = document.getElementById('camera-start');
    cameraStartButton.addEventListener('click', callback);
  }

  bindCapturePhoto(callback) {
    const captureButton = document.getElementById('capture-button');
    captureButton.addEventListener('click', callback);
  }

  bindRecapturePhoto(callback) {
    const recaptureButton = document.getElementById('recapture-button');
    recaptureButton.addEventListener('click', callback);
  }

  bindFormSubmit(callback) {
    const form = document.getElementById('add-story-form');
    form.addEventListener('submit', callback);
  }

  bindMapClick(callback) {
    if (this.map) {
      this.map.on('click', callback);
    }
  }

  initMap() {
    try {
      const mapContainer = document.getElementById('location-map');
      if (!mapContainer) return;
      
      this.map = L.map('location-map').setView([-2.5489, 118.0149], 5);
      
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      
      this.bindMapClick((e) => {
        this.updateMapMarker(e.latlng);
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      const mapContainer = document.getElementById('location-map');
      if (mapContainer) {
        mapContainer.innerHTML = '<p>Gagal memuat peta</p>';
      }
    }
  }

  updateMapMarker(latlng) {
    this.latitude = latlng.lat;
    this.longitude = latlng.lng;
    
    const coordinatesDisplay = document.getElementById('location-coordinates');
    coordinatesDisplay.textContent = `Latitude: ${this.latitude.toFixed(6)}, Longitude: ${this.longitude.toFixed(6)}`;
    
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = L.marker(latlng).addTo(this.map);
    }
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      
      const cameraView = document.getElementById('camera-view');
      cameraView.srcObject = this.stream;
      cameraView.style.display = 'block';
      
      const capturedImage = document.getElementById('captured-image');
      capturedImage.style.display = 'none';
      
      const captureButton = document.getElementById('capture-button');
      captureButton.disabled = false;
      
      const cameraStartButton = document.getElementById('camera-start');
      cameraStartButton.disabled = true;
      
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      return false;
    }
  }

  capturePhoto() {
    const cameraView = document.getElementById('camera-view');
    const canvas = document.createElement('canvas');
    canvas.width = cameraView.videoWidth;
    canvas.height = cameraView.videoHeight;
    const context = canvas.getContext('2d');
    
    context.drawImage(cameraView, 0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        this.photo = blob;
        
        const capturedImage = document.getElementById('captured-image');
        capturedImage.src = URL.createObjectURL(blob);
        capturedImage.style.display = 'block';
        cameraView.style.display = 'none';
        
        const captureButton = document.getElementById('capture-button');
        captureButton.style.display = 'none';
        
        const recaptureButton = document.getElementById('recapture-button');
        recaptureButton.style.display = 'inline-block';
        
        this.stopCameraStream();
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  }

  resetCamera() {
    const capturedImage = document.getElementById('captured-image');
    capturedImage.style.display = 'none';
    
    const recaptureButton = document.getElementById('recapture-button');
    recaptureButton.style.display = 'none';
    
    const cameraStartButton = document.getElementById('camera-start');
    cameraStartButton.disabled = false;
    
    const captureButton = document.getElementById('capture-button');
    captureButton.style.display = 'inline-block';
    
    this.photo = null;
  }

  stopCameraStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.stream = null;
    }
  }

  getFormData() {
    return {
      name: document.getElementById('story-name').value,
      description: document.getElementById('story-description').value,
      photo: this.photo,
      latitude: this.latitude,
      longitude: this.longitude
    };
  }

  showError(message) {
    alert(message);
  }

  cleanup() {
    this.stopCameraStream();
    if (this.map) {
      this.map.remove();
    }
  }
}

export default AddStoryView; 