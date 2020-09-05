require('dotenv').config();
const Sequelize = require('sequelize');
// JAWSDB_URL is `mysql://${username}:${password}@${server}:${port}/${database}`
const sequelize = new Sequelize(process.env.JAWSDB_URL);
const app = require('./app')(sequelize);
const PORT = process.env.PORT || 3001;

(async () => {
  await sequelize.sync({force: false});
  app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
})();
