const {Model, DataTypes} = require('sequelize');

class Post extends Model {}

module.exports = (sequelize) =>
  Post.init(
    {
      id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
      title: {type: DataTypes.STRING, allowNull: false},
      body: {type: DataTypes.TEXT, allowNull: false, validate: {len: [1]}},
      user_id: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'user', key: 'id'}},
      parent_id: {type: DataTypes.INTEGER, allowNull: true, references: {model: 'post', key: 'id'}},
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post',
    }
  );
