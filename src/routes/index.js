const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const offworkRoute = require('./offwork.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/offworks',
    route: offworkRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;