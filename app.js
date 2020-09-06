const exphbs = require('express-handlebars');
const express = require('express');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const hbs = exphbs.create();

module.exports = (sequelize) => {
  const models = require('./models')(sequelize);
  const services = require('./services')(models, sequelize);
  const middleware = require('./middleware')(services);
  const routes = require('./controllers')(services, middleware);

  app.use(
    session({
      secret: 'This is secret?',
      cookie: {},
      resave: false,
      saveUninitialized: true,
      store: new SequelizeStore({db: sequelize}),
    })
  );
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(routes);

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');

  return app;
};
