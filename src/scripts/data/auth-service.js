// src/scripts/data/auth-service.js
import CONFIG from '../config';

const AUTH_KEY = 'storyapp_auth';

class AuthService {
  static getToken() {
    const auth = this.getAuth();
    return auth ? auth.token : null;
  }

  static getAuth() {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  }

  static setAuth(authData) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  }

  static removeAuth() {
    localStorage.removeItem(AUTH_KEY);
  }

  static isLoggedIn() {
    return !!this.getToken();
  }

  static async login({ email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseJson = await response.json();
      
      if (responseJson.error) {
        return { error: true, message: responseJson.message };
      }
      
      // Save auth data to localStorage
      this.setAuth(responseJson.loginResult);
      
      return { error: false, data: responseJson.loginResult };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  static async register({ name, email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const responseJson = await response.json();
      
      if (responseJson.error) {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false, data: responseJson };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  static logout() {
    this.removeAuth();
  }
}

export default AuthService;