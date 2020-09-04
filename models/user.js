const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  checkPassword(pwInput) {
    return bcrypt.compare(pwInput, this.password);
  }
  setPassword(pwInput) {
    return bcrypt.hash(pwInput, 10);
  }
}

module.exports = (sequelize) =>
  User.init(
    {
      id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
      username: {type: DataTypes.STRING, allowNull: false, validate: {len: [1]}},
      password: {type: DataTypes.STRING, allowNull: false},
    },
    {
      hooks: {
        beforeCreate: async (userData) => {
          userData.password = await userData.setPassword(userData.password);
          return userData;
        },
        beforeUpdate: async (userData) => {
          userData.password = await userData.setPassword(userData.password);
          return userData;
        },
      },
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'user',
    }
  );
