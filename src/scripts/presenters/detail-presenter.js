import BasePresenter from './base-presenter';
import { showLoading, hideLoading } from '../utils/loading-utils';

class DetailPresenter extends BasePresenter {
  constructor(model, view, storyId) {
    super(model, view);
    this.storyId = storyId;
  }

  async init() {
    await this.fetchStory();
  }

  async fetchStory() {
    try {
      showLoading();
      const response = await this.model.getStoryDetail(this.storyId);
      hideLoading();
      
      if (response.error) {
        this.showError(response.message);
        return;
      }
      
      this.view.updateStoryUI(response.data);
      this.view.setupMap(response.data);
    } catch (error) {
      hideLoading();
      this.showError('Gagal memuat detail cerita');
      console.error('Error fetching story:', error);
    }
  }
}

export default DetailPresenter; 