module.exports = ({postSvc}) => ({
  mustNotBeLoggedIn(req, res, next) {
    if (req.session.isLoggedIn) return res.status(400).json({message: 'Already logged in'});
    next();
  },
  mustBeLoggedIn(req, res, next) {
    if (!req.session.isLoggedIn) return res.status(400).json({message: 'Not logged in'});
    next();
  },
  mustOwnEndpoint(req, res, next) {
    if (req.params.id !== req.session.user.id.toString()) return res.sendStatus(403);
    next();
  },
  async mustOwnPost(req, res, next) {
    const post = await postSvc.get(req.params.id, 0);
    if (post.user_id !== req.session.user.id) return res.sendStatus(403);
    next();
  },
});
