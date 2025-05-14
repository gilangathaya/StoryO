// src/scripts/pages/add/add-story-page.js
import StoryAPI from '../../data/api';
import { showLoading, hideLoading } from '../../utils/loading-utils';
import CONFIG from '../../config';
import { sleep } from '../../utils';
import StoryModel from '../../models/story-model';
import AddStoryView from '../../views/add-story-view';
import AddStoryPresenter from '../../presenters/add-story-presenter';

let view;

const AddStoryPage = {
  async render() {
    view = new AddStoryView();
    return view.render();
  },

  async afterRender() {
    const model = new StoryModel();
    new AddStoryPresenter(model, view);
    await view.initMap?.(); // If needed, ensure map is initialized
  },

  cleanup() {
    if (view) {
      view.cleanup();
    }
  }
};

export default AddStoryPage;