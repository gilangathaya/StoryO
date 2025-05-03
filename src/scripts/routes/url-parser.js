// src/scripts/routes/url-parser.js

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    pathname = pathname.concat('/:id');
  }

  return pathname || '/';
}

function parseActivePathname() {
  const url = window.location.hash.slice(1).toLowerCase();
  const splitUrl = url.split('/');
  
  const urlSegments = {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
  
  return urlSegments;
}

function getActiveRoute() {
  const pathSegments = parseActivePathname();
  return constructRouteFromSegments(pathSegments);
}

export { parseActivePathname, getActiveRoute };