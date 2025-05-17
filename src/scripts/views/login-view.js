import BaseView from './base-view';

class LoginView extends BaseView {
  render() {
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

  bindFormSubmit(callback) {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', callback);
  }

  getFormData() {
    return {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
  }

  showError(message) {
    const errorContainer = document.getElementById('login-error');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }

  hideError() {
    const errorContainer = document.getElementById('login-error');
    errorContainer.style.display = 'none';
  }

  redirectToHomeAndReload() {
    window.location.hash = '#/';
    window.location.reload();
  }
}

export default LoginView; 