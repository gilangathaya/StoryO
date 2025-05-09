import StoryModel from '../models/story-model';
import StoryView from '../views/story-view';
import { showLoading, hideLoading } from '../utils/loading-utils';

class StoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindMapMarkerClick(this.handleMapMarkerClick.bind(this));
  }

  async init() {
    try {
      showLoading();
      const response = await this.model.getStories();
      hideLoading();
      
      if (response.error) {
        this.view.showError(response.message);
        return;
      }
      
      this.view.displayStories(response.data);
    } catch (error) {
      hideLoading();
      this.view.showError('Failed to load stories');
      console.error('Error initializing stories:', error);
    }
  }

  async handleMapMarkerClick(storyId) {
    try {
      showLoading();
      const response = await this.model.getStoryDetail(storyId);
      hideLoading();
      
      if (response.error) {
        this.view.showError(response.message);
        return;
      }
      
      this.view.displayStoryDetail(response.data);
    } catch (error) {
      hideLoading();
      this.view.showError('Failed to load story detail');
      console.error('Error loading story detail:', error);
    }
  }
}

export default StoryPresenter; 