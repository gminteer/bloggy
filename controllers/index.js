const router = require('express').Router();

module.exports = (services) => {
  router.use('/api', require('./api')(services));
  // router.use('/', require('./ui')(services));
  router.use((_, res) => res.sendStatus(404));
  return router;
};
