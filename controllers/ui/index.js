const router = require('express').Router();

module.exports = ({userSvc, postSvc}, {auth}) => {
  router.get('/', async (req, res) => {
    return res.render('index', {
      post: await postSvc.get(),
      loggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
  router.get('/posts/:id', async (req, res) => {
    const post = await postSvc.get(req.params);
    return res.render('single', {
      post,
      loggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
  router.get('/users/:id', async (req, res) => {
    const post = await postSvc.get({user_id: req.params.id});
    // storing a Date object in a session turns it into an ISO string
    const user = {...req.session.user};
    user.created_at = new Date(user.createdAt); // also not sure why it's getting camelCased here...
    return res.render('user', {
      post,
      loggedIn: req.session.isLoggedIn,
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

  return router;
};
