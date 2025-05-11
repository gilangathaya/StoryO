import BasePresenter from './base-presenter';
import { showLoading, hideLoading } from '../utils/loading-utils';

class LoginPresenter extends BasePresenter {
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
      const response = await this.model.login(formData);
      hideLoading();
      
      if (response.error) {
        this.showError(response.message);
        return;
      }
      
      // Redirect to home page
      window.location.hash = '#/';
      
      // Refresh the page to update UI based on login state
      window.location.reload();
      
    } catch (error) {
      hideLoading();
      this.showError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error during login:', error);
    }
  }
}

export default LoginPresenter; 