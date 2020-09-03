const {Model, DataTypes} = require('sequelize');

class Post extends Model {}

module.exports = (sequelize) =>
  Post.init(
    {
      id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
      title: {type: DataTypes.STRING, allowNull: false},
      postUrl: {type: DataTypes.STRING, allowNull: false, validate: {isUrl: true}},
      userId: {type: DataTypes.INTEGER, references: {model: 'user', key: 'id'}},
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post',
    }
  );
