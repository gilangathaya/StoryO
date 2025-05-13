import StoryAPI from '../data/api';
import { showLoading, hideLoading } from '../utils/loading-utils';

export default class HomePresenter {
  constructor(view) {
    this._view = view;
    this._stories = [];
  }

  async getStories() {
    try {
      showLoading();
      const response = await StoryAPI.getStories();
      hideLoading();
      
      if (response.error) {
        this._view.showErrorMessage(response.message);
        return;
      }
      
      this._stories = response.data;
      this._view.showStories(this._stories);
    } catch (error) {
      hideLoading();
      this._view.showErrorMessage('Gagal memuat data cerita');
      console.error(error);
    }
  }

  getStoriesData() {
    return this._stories;
  }
} 