const router = require('express').Router();

module.exports = (models, sequelize) => {
  router.use('/api', require('./api')(models, sequelize));
  router.use('/', require('./home-routes')(models, sequelize));
  router.use((_, res) => res.sendStatus(404));
  return router;
};
