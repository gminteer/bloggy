const router = require('express').Router();

module.exports = ({userSvc, postSvc}) => {
  router.get('/', async (req, res) => {
    return res.render('index', {
      post: await postSvc.get(),
    });
  });
  router.get('/posts/:id', async (req, res) => {
    return res.render('single', {
      post: await postSvc.get(req.params),
    });
  });
  router.get('/users/:id', async (req, res) => {
    const user = await userSvc.get(req.params.id);
    const post = await postSvc.get({user_id: req.params.id});
    return res.render('user', {
      post,
      user,
    });
  });
  router.get('/signup', (req, res) => {
    if (req.session.isLoggedIn) return res.redirect(`/users/${req.session.user.id}`);
    return res.render('login', {loginType: 'signup'});
  });
  router.get('/login', (req, res) => {
    if (req.session.isLoggedIn) return res.redirect(`/users/${req.session.user.id}`);
    return res.render('login', {loginType: 'login'});
  });
  router.get('/logout', (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/');
    req.session.destroy(() => res.redirect('/'));
  });
  router.get('/submit', (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');
    return res.render('post');
  });
  router.get('/edit/:id', async (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');
    const post = await postSvc.get({id: req.params.id});
    return res.render('edit', post);
  });
  router.get('/delete-user', (req, res) => {
    return res.render('delete_user');
  });
  return router;
};
