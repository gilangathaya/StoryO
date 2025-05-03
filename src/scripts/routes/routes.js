import HomePage from '../pages/home/home-page';
import DetailPage from '../pages/detail/detail-page';
import AddStoryPage from '../pages/add/add-story-page';
import AboutPage from '../pages/about/about-page';
import { parseActivePathname } from './url-parser';

const routes = {
  '/': new HomePage(),
  '/detail/:id': (id) => new DetailPage(id),
  '/add': new AddStoryPage(),
  '/about': new AboutPage(),
};

export default routes;