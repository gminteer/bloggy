const router = require('express').Router();

module.exports = ({userSvc, postSvc}, {auth}) => {
  router.get('/', async (req, res) => {
    const post = (await postSvc.get()).map((dbRow) => dbRow.get());
    return res.render('index', {
      post,
      loggedIn: req.session.isLoggedIn,
    });
  });
  return router;
};
