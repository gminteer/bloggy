const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');

module.exports = (sequelize) => {
  const models = {User: User(sequelize), Post: Post(sequelize), Comment: Comment(sequelize)};
  models.User.hasMany(models.Post, {foreignKey: 'user_id'});
  models.Post.belongsTo(models.User, {foreignKey: 'user_id'});

  models.User.hasMany(models.Comment, {foreignKey: 'user_id'});
  models.Comment.belongsTo(models.User, {foreignKey: 'user_id'});

  models.Post.hasMany(models.Comment, {foreignKey: 'post_id'});
  models.Comment.belongsTo(models.Post, {foreignKey: 'post_id'});
  return models;
};
