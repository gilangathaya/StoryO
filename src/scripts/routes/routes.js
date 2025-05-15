import Home from '../pages/home/home-page';
import DetailPage from '../pages/detail/detail-page';
import AddStoryPage from '../pages/add/add-story-pages';
import About from '../pages/about/about-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import Archive from '../pages/archive';
import AuthService from '../data/auth-service';
import { parseActivePathname } from './url-parser';
import NotFoundPage from '../pages/not-found-page';

const routes = {
  '/': { page: Home, requiresAuth: true },
  '/detail/:id': { page: DetailPage, requiresAuth: true },
  '/add': { page: AddStoryPage, requiresAuth: true },
  '/about': { page: About, requiresAuth: true },
  '/login': { page: LoginPage },
  '/register': { page: RegisterPage },
  '/archive': { page: Archive, requiresAuth: true }
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

  // Return NotFoundPage if route is not found
  if (!route) return NotFoundPage;
  return route.page;
}

export default routes;