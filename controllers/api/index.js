const router = require('express').Router();

module.exports = (models, sequelize, services) => {
  router.use('/users', require('./users')(models, sequelize, services));
  router.use('/posts', require('./posts')(models, sequelize, services));
  return router;
};
