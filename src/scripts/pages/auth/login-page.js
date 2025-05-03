// src/scripts/pages/auth/login-page.js
import AuthService from '../../data/auth-service';
import { showLoading, hideLoading } from '../../utils/loading-utils';

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <div class="form-container">
          <h1 class="form-title">Login</h1>
          
          <form id="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" class="form-input" required placeholder="Masukkan email Anda">
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" class="form-input" required placeholder="Masukkan password Anda">
            </div>
            
            <div id="login-error" class="error-message" style="display: none;"></div>
            
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
          
          <div class="auth-link-container">
            <p>Belum memiliki akun? <a href="#/register">Daftar sekarang</a></p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#setupFormSubmission();
  }

  #setupFormSubmission() {
    const form = document.getElementById('login-form');
    const errorContainer = document.getElementById('login-error');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        showLoading();
        
        const response = await AuthService.login({ email, password });
        
        hideLoading();
        
        if (response.error) {
          errorContainer.textContent = response.message;
          errorContainer.style.display = 'block';
          return;
        }
        
        // Redirect to home page
        window.location.hash = '#/';
        
        // Refresh the page to update UI based on login state
        window.location.reload();
        
      } catch (error) {
        hideLoading();
        errorContainer.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        errorContainer.style.display = 'block';
        console.error('Error during login:', error);
      }
    });
  }
}