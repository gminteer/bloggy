const router = require('express').Router();

module.exports = (models, sequelize) => {
  router.get('/', async (req, res) => {
    const response = await fetch('/api/posts');
    if (!response.ok) return res.status(500).json(response.err);
    const post = await response.json();
    console.log(post);
    return res.render('index', {
      post: [
        {title: 'Test 1', body: 'blah blah blah'},
        {title: 'Test 2', body: 'blah blah blah'},
        {title: 'Test 3', body: 'blah blah blah'},
      ],
      loggedIn: false,
    });
  });
  return router;
};
