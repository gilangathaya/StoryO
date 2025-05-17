import BaseView from './base-view';

class RegisterView extends BaseView {
  render() {
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

  bindFormSubmit(callback) {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', callback);
  }

  getFormData() {
    return {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
  }

  showError(message) {
    const errorContainer = document.getElementById('register-error');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }

  hideError() {
    const errorContainer = document.getElementById('register-error');
    errorContainer.style.display = 'none';
  }

  showSuccessAndRedirectToLogin(message) {
    alert(message);
    window.location.hash = '#/login';
  }
}

export default RegisterView; 