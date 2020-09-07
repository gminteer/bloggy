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
    if (!req.session.isLoggedIn) return res.sendStatus(403);
    if (req.params.id !== req.session.user.id.toString()) return res.sendStatus(403);
    next();
  },
  async mustOwnPost(req, res, next) {
    if (!req.session.isLoggedIn) return res.sendStatus(403);
    const post = await postSvc.get({id: req.params.id, depth: 0});
    if (post.user.id !== req.session.user.id) return res.sendStatus(403);
    next();
  },
});
