module.exports = (models, sequelize) => ({
  userSvc: require('./user')(models, sequelize),
  postSvc: require('./post')(models, sequelize),
});
