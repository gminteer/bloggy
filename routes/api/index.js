const router = require('express').Router();

module.exports = (models, sequelize) => {
  router.use('/users', require('./user-routes')(models, sequelize));
  router.use('/posts', require('./post-routes')(models, sequelize));
  return router;
};
