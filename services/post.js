module.exports = ({User, Post}) => {
  // there's probably a better way to do this
  const includeComment = () => ({
    model: Post,
    as: 'comments',
    foreignKey: 'parent_id',
    attributes: ['id', 'title', 'body', 'created_at'],
    include: [{model: User, attributes: ['username']}],
  });
  /**
   * nests comment include blocks (up to depth)
   * @param {number} depth how many levels of comments should be included
   * @return {object} a sequelize include parameter
   */
  function getComments(depth) {
    let out = '';
    for (let i = 0; i < depth; i++) {
      if (out) {
        const nested = includeComment();
        nested.include.push(out);
        out = nested;
      } else {
        out = includeComment();
      }
    }
    return out;
  }

  return {
    get(id = null, depth = 6) {
      if (!id) {
        return Post.findAll({
          where: {parent_id: null},
          attributes: ['id', 'title', 'body', 'created_at'],
          include: [{model: User, attributes: ['username']}],
        });
      }
      const params = {
        where: {id},
        attributes: ['id', 'title', 'body', 'created_at'],
        include: [{model: User, attributes: ['username']}],
      };
      if (depth) params.include.push(getComments(depth));
      return Post.findOne(params);
    },
    async create(post = {user_id: '', title: '', body: '', parent_id: null}) {
      if (post.parent_id && !(await this.get(post.parent_id, 0))) return;
      return Post.create(post);
    },
    async update(id, title, body) {
      const post = await Post.findOne({where: {id}});
      if (!post) return;
      if (title) post.title = title;
      if (body) post.body = body;
      await post.save();
      return post;
    },
    async delete(id) {
      const post = Post.findOne({where: {id}});
      if (!post) return;
      await post.destroy();
      return post;
    },
  };
};
