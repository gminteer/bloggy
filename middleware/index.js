module.exports = (services) => ({
  auth: require('./auth')(services),
  handlebars: require('./handlebars'),
});
