const router = require('express').Router();

module.exports = (services, middleware) => {
  router.use('/api', require('./api')(services, middleware));
  // router.use('/', require('./ui')(services, middleware));
  router.use((_, res) => res.sendStatus(404));
  return router;
};
