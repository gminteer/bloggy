module.exports = (sequelize) => {
  const User = require('./user')(sequelize);
  const Post = require('./post')(sequelize);
  
  User.hasMany(Post, {foreignKey: 'user_id'});
  Post.belongsTo(User, {foreignKey: 'user_id'});

  Post.belongsTo(Post, {foreignKey: 'parent_id'});
  Post.hasMany(Post, {foreignKey: 'parent_id'});
  return {User, Post};
};
