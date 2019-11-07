module.exports = [
  {
    path: /^\/user\/login/,
    method: 'POST',
    scope: 'public',
  }, {
    path: /^\/user\/logout/,
    method: 'POST',
    scope: 'user',
  }, {
    // creating user
    path: /^\/user\/?$/,
    method: 'POST',
    scope: 'public',
  }, {
    // getting own user
    path: /^\/user\/?$/,
    method: 'GET',
    scope: 'user',
  }, {
    // getting all areas
    path: /^\/area\/?$/,
    method: 'GET',
    scope: 'public',
  }, {
    // getting all regions
    path: /^\/region\/[a-zA-Z0-9]+$/,
    method: 'GET',
    scope: 'public',
  }, {
    // getting one region
    path: /^\/region\/one\/[a-zA-Z0-9]+$/,
    method: 'GET',
    scope: 'public',
  }, {
    // getting all crags from spec region
    path: /^\/crag\/[a-zA-Z0-9]+$/,
    method: 'GET',
    scope: 'public',
  }, {
    // getting all routes from spec crag
    path: /^\/route\/[a-zA-Z0-9]+$/,
    method: 'GET',
    scope: 'public',
  },
];
