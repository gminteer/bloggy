module.exports = ({User}) => ({
  getAll() {
    return User.findAll({attributes: {exlclude: ['password']}});
  },

  getOne(id) {
    return User.findOne({attributes: {exlclude: ['password']}, where: {id}});
  },

  create(username, password) {
    return User.create({username, password});
  },

  async update(id, username, password) {
    const user = await User.findOne({where: {id}});
    if (!user) return;
    if (username) user.username = username;
    if (password) user.password = password;
    await user.save();
    const {password: _, ...sanitizedUser} = user.get();
    return sanitizedUser;
  },

  async delete(id) {
    const user = await User.findOne({exclude: ['password'], where: {id}});
    if (!user) return;
    const deletedCount = await user.destroy();
    if (deletedCount) return user;
  },
});
