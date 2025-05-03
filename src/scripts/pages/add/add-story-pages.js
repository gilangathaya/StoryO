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
                  <img id="captured-image" alt="Hasil foto">
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
    `;}}