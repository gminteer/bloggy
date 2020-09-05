const models = require('../models');

module.exports = (models, sequelize) => ({
  users: require('./users')(models, sequelize),
  // posts: require('./posts')(models, sequelize),
});
