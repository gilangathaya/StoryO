import StoryModel from '../models/story-model';
import ArchiveView from '../views/archive-view';
import ArchivePresenter from '../presenters/archive-presenter';

let view;

const Archive = {
  async render() {
    view = new ArchiveView();
    return view.render();
  },

  async afterRender() {
    const model = new StoryModel();
    new ArchivePresenter(model, view);
  }
};

export default Archive; 