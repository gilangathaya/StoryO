import StoryModel from '../models/story-model';
import StoryView from '../views/story-view';

class StoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindMapMarkerClick(this.handleMapMarkerClick.bind(this));
  }

  async init() {
    const response = await this.model.getStories();
    this.view.displayStories(response);
  }

  async handleMapMarkerClick(storyId) {
    const response = await this.model.getStoryDetail(storyId);
    this.view.displayStoryDetail(response);
  }
}

export default StoryPresenter; 