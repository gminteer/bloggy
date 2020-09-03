const router = require('express').Router();

module.exports = ({User, Post, Vote, Comment}) => {
  // GET /
  router.get('/', async (_, res) => {
    try {
      const users = await User.findAll({attributes: {exclude: ['password']}});
      if (users.length < 1) return res.status(404).json({message: 'No users in database'});
      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });
  // GET /1
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findOne({
        where: req.params,
        attributes: {exclude: ['password']},
      });
      if (!user)
        return res.status(404).json({message: `No user found with id: "${req.params.id}"`});
      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });
  // POST /
  router.post('/', async (req, res) => {
    try {
      const {username, password, email} = req.body;
      const user = await User.create({username, password, email});
      req.session.save(() => {
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.loggedIn = true;
        const {id, username, email} = user;
        return res
          .status(201)
          .append('Location', id)
          .json({user: {id, username, email}, message: 'Login successful.'});
      });
    } catch (err) {
      if (['SequelizeUniqueConstraintError', 'SequelizeValidationError'].includes(err.name))
        res.status(422);
      else res.status(500);
      console.error(err);
      return res.json(err);
    }
  });
  // POST /login
  router.post('/login', async (req, res) => {
    try {
      const {username, password} = req.body;
      const user = await User.findOne({where: {username}});
      if (!user)
        return res.status(404).json({message: `No user found with username: "${username}"`});
      const isValidPassword = await user.checkPassword(password);
      if (!isValidPassword) return res.status(403).json({message: 'Invalid password.'});
      const {id, email} = user;
      req.session.save(() => {
        req.session.userId = id;
        req.session.username = username;
        req.session.loggedIn = true;
        return res.json({user: {id, username, email}, message: 'Login successful.'});
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });
  // POST /logout
  router.post('/logout', (req, res) => {
    if (req.session.loggedIn) req.session.destroy(() => res.redirect('/'));
    else return res.sendStatus(400);
  });
  // PUT /1
  router.put('/:id', async (req, res) => {
    try {
      const {username, password, email} = req.body;
      const update = {};
      if (username) update.username = username;
      if (password) update.password = password;
      if (email) update.email = email;
      const [changedCount] = await User.update(update, {individualHooks: true, where: req.params});
      if (!changedCount)
        return res.status(404).json({message: `No user found with id: "${req.params.id}"`});
      return res.sendStatus(204);
    } catch (err) {
      if (['SequelizeUniqueConstraintError', 'SequelizeValidationError'].includes(err.name))
        res.status(422);
      else res.status(500);
      console.log(err);
      return res.json(err);
    }
  });
  // DELETE /1
  router.delete('/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const [changedCount] = await User.destroy({where: {id}});
      if (!changedCount) return res.status(404).json({message: `No user found with id: "${id}"`});
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });
  return router;
  //
};
