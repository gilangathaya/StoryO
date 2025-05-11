import StoryModel from '../models/story-model';
import HomeView from '../views/home-view';
import HomePresenter from '../presenters/home-presenter';

let view;

const Home = {
  async render() {
    view = new HomeView();
    return view.render();
  },

  async afterRender() {
    const model = new StoryModel();
    new HomePresenter(model, view);
  }
};

export default Home; 