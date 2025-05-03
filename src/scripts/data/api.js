import CONFIG from '../config';
import AuthService from './auth-service';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
};

class StoryAPI {
  static #getAuthHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  static async getStories() {
    try {
      const response = await fetch(`${ENDPOINTS.GET_STORIES}?location=1`, {
        headers: this.#getAuthHeaders()
      });
      const responseJson = await response.json();
      
      if (responseJson.error) {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false, data: responseJson.listStory };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  static async getStoryDetail(id) {
    try {
      const response = await fetch(ENDPOINTS.GET_STORY_DETAIL(id), {
        headers: this.#getAuthHeaders()
      });
      const responseJson = await response.json();
      
      if (responseJson.error) {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false, data: responseJson.story };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  static async addStory({ description, photo, lat, lon }) {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      
      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      const response = await fetch(ENDPOINTS.ADD_STORY, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: formData,
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
}

export default StoryAPI;