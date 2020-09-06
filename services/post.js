module.exports = ({User, Post}) => {
  // there's probably a better way to do this
  const includeComment = () => ({
    model: Post,
    as: 'comments',
    foreignKey: 'parent_id',
    attributes: ['id', 'title', 'body', 'created_at'],
    include: [{model: User, attributes: ['username', 'id']}],
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
    async get({id = null, user_id = null, depth = 6} = {}) {
      if (!id || user_id) {
        const where = user_id ? {user_id} : {parent_id: null};
        const posts = await Post.findAll({
          where,
          attributes: ['id', 'user_id', 'title', 'body', 'created_at'],
          include: [{model: User, attributes: ['username', 'id']}],
        });
        const processedPosts = [];
        for (const post of posts) {
          const processedPost = post.get({plain: true});
          processedPost.commentCount = await post.countComments();
          processedPosts.push(processedPost);
        }
        return processedPosts;
      }
      const params = {
        where: {id},
        attributes: ['id', 'user_id', 'title', 'body', 'created_at'],
        include: [{model: User, attributes: ['username']}],
      };
      if (depth) params.include.push(getComments(depth));
      const post = await Post.findOne(params);
      if (!post) return;
      return post.get({plain: true});
    },
    async create(post = {user_id: '', title: '', body: '', parent_id: null}) {
      if (post.parent_id && !(await this.get({id: post.parent_id, depth: 0}))) return;
      const newPost = await Post.create(post);
      return newPost.get({plain: true});
    },
    async update(id, title, body) {
      const post = await Post.findOne({where: {id}});
      if (!post) return;
      if (title) post.title = title;
      if (body) post.body = body;
      await post.save();
      return post.get({plain: true});
    },
    async delete(id) {
      const post = await Post.findOne({where: {id}});
      if (!post) return;
      await post.destroy();
      return post.get({plain: true});
    },
  };
};
