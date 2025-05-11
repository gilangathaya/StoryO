import StoryModel from '../../models/story-model';
import DetailView from '../../views/detail-view';
import DetailPresenter from '../../presenters/detail-presenter';

let view;

const DetailPage = {
  async render() {
    view = new DetailView();
    return view.render();
  },

  async afterRender() {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const storyId = urlParams.get('id');
    
    if (!storyId) {
      window.location.hash = '#/';
      return;
    }

    const model = new StoryModel();
    new DetailPresenter(model, view, storyId);
  }
};

export default DetailPage;