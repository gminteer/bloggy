const {Model, DataTypes} = require('sequelize');

class Post extends Model {}

module.exports = (sequelize) =>
  Post.init(
    {
      id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
      title: {type: DataTypes.STRING, allowNull: false},
      body: {type: DataTypes.TEXT, allowNull: false, validate: {len: [1]}},
      userId: {type: DataTypes.INTEGER, references: {model: 'user', key: 'id'}},
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post',
    }
  );
