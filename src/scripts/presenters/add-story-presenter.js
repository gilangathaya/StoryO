import BasePresenter from './base-presenter';
import { showLoading, hideLoading } from '../utils/loading-utils';
import { sleep } from '../utils';

class AddStoryPresenter extends BasePresenter {
  constructor(model, view) {
    super(model, view);
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.view.bindCameraStart(this.handleCameraStart.bind(this));
    this.view.bindCapturePhoto(this.handleCapturePhoto.bind(this));
    this.view.bindRecapturePhoto(this.handleRecapturePhoto.bind(this));
    this.view.bindFormSubmit(this.handleFormSubmit.bind(this));
  }

  async init() {
    await sleep(300); // Wait for DOM to be ready
    this.view.initMap();
  }

  async handleCameraStart() {
    const success = await this.view.startCamera();
    if (!success) {
      this.showError('Gagal mengakses kamera. Pastikan kamera tersedia dan izin diberikan.');
    }
  }

  async handleCapturePhoto() {
    await this.view.capturePhoto();
  }

  handleRecapturePhoto() {
    this.view.resetCamera();
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = this.view.getFormData();
    
    // Validate inputs
    if (!formData.name || !formData.description) {
      this.showError('Mohon isi nama dan deskripsi cerita.');
      return;
    }
    
    if (!formData.photo) {
      this.showError('Mohon ambil foto untuk cerita Anda.');
      return;
    }
    
    try {
      showLoading();
      
      // Prepare story data
      const storyData = {
        description: `${formData.name}: ${formData.description}`,
        photo: formData.photo,
      };
      
      // Add location if available
      if (formData.latitude && formData.longitude) {
        storyData.lat = formData.latitude;
        storyData.lon = formData.longitude;
      }
      
      // Submit to API
      const response = await this.model.addStory(storyData);
      hideLoading();
      
      if (response.error) {
        this.showError(`Gagal menambahkan cerita: ${response.message}`);
        return;
      }
      
      // Show success message and redirect to home
      alert('Cerita berhasil ditambahkan!');
      window.location.hash = '#/';
      
    } catch (error) {
      hideLoading();
      console.error('Error adding story:', error);
      this.showError('Terjadi kesalahan saat menambahkan cerita. Silakan coba lagi.');
    } finally {
      this.view.cleanup();
    }
  }
}

export default AddStoryPresenter; 