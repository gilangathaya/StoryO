import HomePage from '../pages/home/home-page';
import DetailPage from '../pages/detail/detail-page';
import AddStoryPage from '../pages/add/add-story-pages';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import AuthService from '../data/auth-service';
import { parseActivePathname } from './url-parser';

const routes = {
  '/': new HomePage(),
  '/detail/:id': (id) => new DetailPage(id),
  '/add': {
    page: new AddStoryPage(),
    requiresAuth: true
  },
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage()
};

export function getRoute(path) {
  const urlSegments = parseActivePathname();
  let route = routes[path];

  // Handle routes with parameters
  if (path.includes(':id') && urlSegments.id) {
    const routeFunction = routes[path];
    if (typeof routeFunction === 'function') {
      route = routeFunction(urlSegments.id);
    }
  }

  // Check if route requires authentication
  if (route && route.requiresAuth && !AuthService.isLoggedIn()) {
    window.location.hash = '#/login';
    return null;
  }

  return route?.page || route || routes['/'];
}

export default routes;