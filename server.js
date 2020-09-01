require('dotenv').config();
const sequelize = require('./config/connection');
const app = require('./app')(sequelize);
const PORT = process.env.PORT || 3001;

(async () => {
  await sequelize.sync({force: false});
  app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
})();
