import BasePresenter from './base-presenter';
import { showLoading, hideLoading } from '../utils/loading-utils';

class StoryPresenter extends BasePresenter {
  constructor(model, view) {
    super(model, view);
    this.view.bindMapMarkerClick(this.handleMapMarkerClick.bind(this));
  }

  async init() {
    try {
      showLoading();
      const response = await this.model.getStories();
      hideLoading();
      
      if (response.error) {
        this.showError(response.message);
        return;
      }
      
      this.view.displayStories(response.data);
    } catch (error) {
      hideLoading();
      this.showError('Failed to load stories');
      console.error('Error initializing stories:', error);
    }
  }

  async handleMapMarkerClick(storyId) {
    try {
      showLoading();
      const response = await this.model.getStoryDetail(storyId);
      hideLoading();
      
      if (response.error) {
        this.showError(response.message);
        return;
      }
      
      this.view.displayStoryDetail(response.data);
    } catch (error) {
      hideLoading();
      this.showError('Failed to load story detail');
      console.error('Error loading story detail:', error);
    }
  }
}

export default StoryPresenter; 