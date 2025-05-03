// src/scripts/pages/auth/register-page.js
import AuthService from '../../data/auth-service';
import { showLoading, hideLoading } from '../../utils/loading-utils';

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <div class="form-container">
          <h1 class="form-title">Daftar Akun</h1>
          
          <form id="register-form">
            <div class="form-group">
              <label for="name" class="form-label">Nama</label>
              <input type="text" id="name" class="form-input" required placeholder="Masukkan nama Anda">
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" class="form-input" required placeholder="Masukkan email Anda">
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" class="form-input" required minlength="8" placeholder="Minimal 8 karakter">
            </div>
            
            <div id="register-error" class="error-message" style="display: none;"></div>
            
            <button type="submit" class="btn btn-primary">Daftar</button>
          </form>
          
          <div class="auth-link-container">
            <p>Sudah memiliki akun? <a href="#/login">Login disini</a></p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#setupFormSubmission();
  }

  #setupFormSubmission() {
    const form = document.getElementById('register-form');
    const errorContainer = document.getElementById('register-error');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        showLoading();
        
        const response = await AuthService.register({ name, email, password });
        
        hideLoading();
        
        if (response.error) {
          errorContainer.textContent = response.message;
          errorContainer.style.display = 'block';
          return;
        }
        
        // Show success notification
        alert('Pendaftaran berhasil! Silakan login.');
        
        // Redirect to login page
        window.location.hash = '#/login';
        
      } catch (error) {
        hideLoading();
        errorContainer.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        errorContainer.style.display = 'block';
        console.error('Error during registration:', error);
      }
    });
  }
}