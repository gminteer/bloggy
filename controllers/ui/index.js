const router = require('express').Router();

module.exports = ({userSvc, postSvc}, {auth}) => {
  router.get('/', async (req, res) => {
    return res.render('index', {
      isLoggedIn: req.session.isLoggedIn,
      currentUser: req.session.user,
      post: await postSvc.get(),
    });
  });
  router.get('/posts/:id', async (req, res) => {
    return res.render('single', {
      isLoggedIn: req.session.isLoggedIn,
      currentUser: req.session.user,
      post: await postSvc.get(req.params),
    });
  });
  router.get('/users/:id', async (req, res) => {
    const user = await userSvc.get(req.params.id);
    const post = await postSvc.get({user_id: req.params.id});
    return res.render('user', {
      isLoggedIn: req.session.isLoggedIn,
      currentUser: req.session.user,
      post,
      user,
    });
  });
  router.get('/login', (req, res) => {
    if (req.session.isLoggedIn) return res.redirect(`/users/${req.session.user.id}`);
    return res.render('login');
  });
  router.get('/logout', (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/');
    req.session.destroy(() => res.redirect('/'));
  });

  router.get('/posts', (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');
    return res.render('post', {
      isLoggedIn: req.session.isLoggedIn,
      currentUser: req.session.currentUser,
    });
  });
  return router;
};
