module.exports = ({User}) => ({
  async get(id) {
    if (id) {
      const user = await User.findOne({attributes: {exclude: ['password']}, where: {id}});
      return user.get();
    } else {
      const users = await User.findAll({attributes: {exclude: ['password']}});
      return users.map((user) => user.get());
    }
  },

  async create(username, password) {
    const user = await User.create({username, password});
    return user.get();
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
    const {password: _, ...sanitizedUser} = user.get();
    if (deletedCount) return sanitizedUser;
  },

  async login(username, password) {
    const user = await User.findOne({where: {username}});
    if (!user) return {ok: false, error: 'NOT_FOUND'};
    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) return {ok: false, error: 'BAD_PASSWORD'};
    const {password: _, ...sanitizedUser} = user.get();
    return {ok: true, user: sanitizedUser};
  },
});