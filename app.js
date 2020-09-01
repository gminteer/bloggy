const exphbs = require('express-handlebars');
const express = require('express');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

module.exports = (sequelize) => {
  const app = express();
  const hbs = exphbs.create({});
  const models = require('./models')(sequelize);
  const routes = require('./routes')(models, sequelize);

  const sess = {
    secret: 'This is secret?',
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({db: sequelize}),
  };

  app.use(session(sess));
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(routes);

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');

  return app;
};
