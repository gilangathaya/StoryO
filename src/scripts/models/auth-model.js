import AuthService from '../data/auth-service';

class AuthModel {
  async login(credentials) {
    try {
      const response = await AuthService.login(credentials);
      return response;
    } catch (error) {
      return { error: true, message: 'Failed to login' };
    }
  }

  async register(userData) {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      return { error: true, message: 'Failed to register' };
    }
  }

  logout() {
    AuthService.logout();
  }

  isLoggedIn() {
    return AuthService.isLoggedIn();
  }
}

export default AuthModel; 