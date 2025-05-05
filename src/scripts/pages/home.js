import StoryModel from '../models/story-model';
import StoryView from '../views/story-view';
import StoryPresenter from '../presenters/story-presenter';

const Home = {
  async render() {
    return `
      <div id="storyList"></div>
      <div id="storyDetail"></div>
    `;
  },

  async afterRender() {
    const model = new StoryModel();
    const view = new StoryView();
    const presenter = new StoryPresenter(model, view);
    await presenter.init();
  }
};

export default Home; 