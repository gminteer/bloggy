const router = require('express').Router();

module.exports = ({User, Post}) => {
  // GET / (get all top level posts)
  router.get('/', async (_, res) => {
    try {
      const posts = await Post.findAll({
        attributes: ['id', 'title', 'body', 'created_at'],
        include: [
          {model: User, attributes: ['username']},
          {
            model: Post,
            as: 'comments',
            foreignKey: 'parent_id',
            attributes: ['id', 'title', 'body', 'created_at'],
            include: {model: User, attributes: ['username']},
          },
        ],
        where: {parent_id: null},
      });
      if (posts.length < 1) return res.status(404).json({message: 'No posts in database'});
      else return res.json(posts);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  });

  // GET /1 (get a specific post and its direct comments)
  router.get('/:id', async (req, res) => {
    try {
      const post = await Post.findOne({
        where: req.params,
        attributes: ['id', 'title', 'body', 'created_at'],
        include: [
          {model: User, attributes: ['username']},
          {model: Post, foreignKey: 'parent_id', include: {model: User, attributes: ['username']}},
        ],
      });
      if (!post)
        return res.status(404).json({message: `No post found with id: "${req.params.id}"`});
      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  });
  // POST / (create a top level post)
  router.post('/', async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(403).json({message: 'Not logged in'});
    try {
      const {title, body} = req.body;
      const {user_id} = req.session;
      const post = await Post.create({title, body, user_id});
      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  });
  // POST /1 (create a comment (post with a parent post))
  router.post('/:id', async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(403).json({message: 'Not logged in'});
    try {
      const parent = await Post.findOne({where: req.params});
      if (!parent)
        return res.status(404).json({message: `No post found with id: "${req.params.id}"`});
      const {title, body} = req.body;
      const {user_id} = req.session;
      const post = await Post.create({title, body, user_id, parent_id: parent.id});
      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  });
  // PUT /1 (change a post)
  router.put('/:id', async (req, res) => {
    try {
      const {title} = req.body;
      const [changedCount] = await Post.update({title}, {where: req.params});
      if (!changedCount)
        return res.status(404).json({message: `No post found with id: "${req.params.id}"`});
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  });
  // DELETE /1 (delete a post)
  router.delete('/:id', async (req, res) => {
    try {
      const deletedCount = await Post.destroy({where: req.params});
      if (!deletedCount)
        return res.status(404).json({message: `No post found with id: "${req.params.id}"`});
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  });

  return router;
};
