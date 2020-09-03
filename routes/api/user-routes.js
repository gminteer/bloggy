const router = require('express').Router();

module.exports = ({User, Post}) => {
  // GET /
  router.get('/', async (_, res) => {
    try {
      const users = await User.findAll({attributes: {exclude: ['password']}});
      if (users.length < 1) return res.status(404).json({message: 'No users in database'});
      return res.json(users);
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
      if (err.errors) {
        const errors = err.errors.map((error) => {
          const {instance: _, ...sanitized} = error;
          return sanitized;
        });
        return res.json(errors);
      } else {
        return res.json(err);
      }
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
      console.error(err);
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
      if (!username && !password && !email) return res.sendStatus(400);
      const user = await User.findOne({where: req.params});
      if (!user)
        return res.status(404).json({message: `No user found with id: "${req.params.id}"`});
      if (username) user.username = username;
      if (password) user.password = password;
      if (email) user.email = email;
      await user.save();
      const {password: _, ...sanitized} = user.get();
      return res.status(200).json({message: 'Update successful', user: sanitized});
    } catch (err) {
      if (['SequelizeUniqueConstraintError', 'SequelizeValidationError'].includes(err.name))
        res.status(422);
      else res.status(500);
      console.error(err);
      if (err.errors) {
        const errors = err.errors.map((error) => {
          const {instance: _, ...sanitized} = error;
          return sanitized;
        });
        return res.json(errors);
      } else {
        return res.json(err);
      }
    }
  });
  // DELETE /1
  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findOne({
        where: req.params,
        attributes: {exclude: ['password']},
      });
      const deletedCount = await User.destroy({where: req.params});
      if (!deletedCount)
        return res.status(404).json({message: `No user found with id: "${req.params.id}"`});
      return res.status(200).json({message: 'Delete successful', user: user.get()});
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  });
  return router;
  //
};
