const router = require('express').Router();

module.exports = ({postSvc}, {auth}, handleErr) => {
  // GET / (get all top level posts)
  router.get('/', async (req, res) => {
    try {
      const posts = await postSvc.get(null, 0);
      if (posts.length < 1) return res.status(404).json({message: 'No posts in database'});
      else return res.json(posts);
    } catch (err) {
      handleErr(err);
    }
  });

  // GET /1 (get a specific post and related comments, up to depth (hard capped at 6))
  router.get('/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const commentDepth = req.query.comment_depth
        ? Math.min(Number(req.query.comment_depth), 6)
        : 6;
      const post = await postSvc.get(id, commentDepth);
      if (!post) return res.status(404).json({message: `No post found with id: "${id}"`});
      return res.json(post);
    } catch (err) {
      handleErr(err);
    }
  });
  // POST / (create a top level post)
  router.post('/', auth.mustBeLoggedIn, async (req, res) => {
    try {
      const {title, body} = req.body;
      const user_id = req.session.user.id;
      const post = await postSvc.create({user_id, title, body});
      return res.json(post);
    } catch (err) {
      handleErr(err);
    }
  });
  // POST /1 (create a comment (post with a parent post))
  router.post('/:id', auth.mustBeLoggedIn, async (req, res) => {
    try {
      const {title, body} = req.body;
      const user_id = req.session.user.id;
      const parent_id = req.params.id;
      const post = await postSvc.create({title, body, user_id, parent_id});
      return res.json(post);
    } catch (err) {
      handleErr(err);
    }
  });
  // PUT /1 (change a post)
  router.put('/:id', auth.mustOwnPost, async (req, res) => {
    try {
      const {id} = req.params;
      const {title, body} = req.body;
      if (!title && !body) return res.status(400).json({message: 'Nothing to update'});
      const post = await postSvc.update(id, title, body);
      if (!post) return res.status(404).json({message: `No post found with id: "${id}"`});
      return res.status(200).json({message: 'Post updated successfully', post});
    } catch (err) {
      handleErr(err);
    }
  });
  // DELETE /1 (delete a post)
  router.delete('/:id', auth.mustOwnPost, async (req, res) => {
    try {
      const {id} = req.params;
      const post = await postSvc.delete(id);
      if (!post) return res.status(404).json({message: `No post found with id: "${id}"`});
      return res.status(200).json({message: 'Post deleted successfully', post});
    } catch (err) {
      handleErr(err);
    }
  });

  return router;
};
