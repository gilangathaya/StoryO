import BasePresenter from './base-presenter';
import { showLoading, hideLoading } from '../utils/loading-utils';

class RegisterPresenter extends BasePresenter {
  constructor(model, view) {
    super(model, view);
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.view.bindFormSubmit(this.handleFormSubmit.bind(this));
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    this.view.hideError();
    
    const formData = this.view.getFormData();
    
    try {
      showLoading();
      const response = await this.model.register(formData);
      hideLoading();
      
      if (response.error) {
        this.showError(response.message);
        return;
      }
      
      // Delegate success message and navigation to the View
      this.view.showSuccessAndRedirectToLogin('Pendaftaran berhasil! Silakan login.');
      
    } catch (error) {
      hideLoading();
      this.showError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error during registration:', error);
    }
  }
}

export default RegisterPresenter; 