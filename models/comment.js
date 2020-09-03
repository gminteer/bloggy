const {Model, DataTypes} = require('sequelize');

class Comment extends Model {}

module.exports = (sequelize) =>
  Comment.init(
    {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      body: {type: DataTypes.TEXT, allowNull: false, validate: {len: [1]}},
      userId: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'user', key: 'id'}},
      postId: {type: DataTypes.INTEGER, allowNull: false, references: {model: 'post', key: 'id'}},
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'comment',
    }
  );
