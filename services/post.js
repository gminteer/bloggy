module.exports = ({User, Post}) => {
  // there's probably a better way to do this
  const includeComment = () => ({
    model: Post,
    as: 'comments',
    foreignKey: 'parent_id',
    attributes: ['id', 'parent_id', 'title', 'body', 'created_at'],
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

  async function countComments(id) {
    const post = await Post.findOne({where: {id}});
    if (!post) return;
    let commentCount = await post.countComments();
    if (commentCount) {
      const comments = await post.getComments();
      for (const comment of comments) commentCount += await countComments(comment.id);
    }
    return commentCount;
  }

  // modifies input object, there's probably a cleaner way to do this that doesn't depend on side effects.
  async function countRepliesAtMaxDepth(post) {
    if (post.comments) for (const comment of post.comments) await countRepliesAtMaxDepth(comment);
    else post.commentCount = await countComments(post.id);
  }

  return {
    async get({id = null, user_id = null, depth = 6} = {}) {
      const params = {
        attributes: ['id', 'parent_id', 'title', 'body', 'created_at'],
        include: [{model: User, attributes: ['username', 'id']}],
        order: [['created_at', 'DESC']],
      };
      if (!id || user_id) {
        const where = {parent_id: null};
        if (user_id) where.user_id = user_id;
        params.where = where;
        const posts = await Post.findAll(params);
        const processedPosts = [];
        for (const post of posts) {
          const processedPost = post.get({plain: true});
          processedPost.commentCount = await countComments(post.id);
          processedPosts.push(processedPost);
        }
        return processedPosts;
      }
      params.where = {id};
      if (depth) params.include.push(getComments(depth));
      const post = await Post.findOne(params);
      if (!post) return;
      const jsonPost = post.get({plain: true});
      if (depth) await countRepliesAtMaxDepth(jsonPost);
      return jsonPost;
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
