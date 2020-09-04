const router = require('express').Router();

function handleErr(req, res, err) {
  console.error(err);
  if (['SequelizeUniqueConstraintError', 'SequelizeValidationError'].includes(err.name)) {
    const errors = err.errors.map((error) => {
      const {instance: _, ...sanitizedError} = error;
      return sanitizedError;
    });
    return res.status(422).json(errors);
  }
  if (process.env.NODE_ENV !== 'production') return res.status(500).json(err);
  else return res.sendStatus(500);
}

module.exports = ({User}) => {
  // GET / (get all users)
  router.get('/', async (_, res) => {
    try {
      const users = await User.findAll({attributes: {exclude: ['password']}});
      if (users.length < 1) return res.status(404).json({message: 'No users in database'});
      return res.json(users);
    } catch (err) {
      handleErr(err);
    }
  });

  // GET /1 (get one user)
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
      handleErr(err);
    }
  });

  // POST / (create a user)
  router.post('/', async (req, res) => {
    if (req.session.isLoggedIn) return res.status(400).json({message: 'Already logged in'});
    try {
      const {username, password} = req.body;
      const user = await User.create({username, password});
      req.session.save(() => {
        const {id, username} = user;
        req.session.user_id = id;
        req.session.username = username;
        req.session.isLoggedIn = true;
        return res
          .status(201)
          .append('Location', id)
          .json({user: {id, username}, message: 'Login successful.'});
      });
    } catch (err) {
      handleErr(err);
    }
  });

  // POST /login (login as user)
  router.post('/login', async (req, res) => {
    if (req.session.isLoggedIn) return res.status(400).json({message: 'Already logged in'});
    try {
      const {username, password} = req.body;
      const user = await User.findOne({where: {username}});
      if (!user)
        return res.status(404).json({message: `No user found with username: "${username}"`});
      const isValidPassword = await user.checkPassword(password);
      if (!isValidPassword) return res.status(403).json({message: 'Invalid password.'});
      const {id} = user;
      req.session.save(() => {
        req.session.user_id = id;
        req.session.username = username;
        req.session.isLoggedIn = true;
        return res.json({user: {id, username}, message: 'Login successful.'});
      });
    } catch (err) {
      handleErr(err);
    }
  });

  // POST /logout (logout)
  router.post('/logout', (req, res) => {
    if (req.session.isLoggedIn) req.session.destroy(() => res.sendStatus(204));
    else return res.sendStatus(400);
  });

  // PUT /1 (change a user)
  router.put('/:id', async (req, res) => {
    if (req.params.id !== req.session.user_id.toString()) return res.sendStatus(403);
    try {
      const {username, password} = req.body;
      if (!username && !password) return res.sendStatus(400);
      const user = await User.findOne({where: req.params});
      if (!user)
        return res.status(404).json({message: `No user found with id: "${req.params.id}"`});
      if (username) user.username = username;
      if (password) user.password = password;
      await user.save();
      const {password: _, ...sanitizedUser} = user.get();
      return res.status(200).json({message: 'Update successful', user: sanitizedUser});
    } catch (err) {
      handleErr(err);
    }
  });

  // DELETE /1 (delete a user)
  router.delete('/:id', async (req, res) => {
    if (req.params.id !== req.session.user_id.toString()) return res.sendStatus(403);
    try {
      const deletedCount = await User.destroy({where: req.params});
      if (!deletedCount) {
        if (process.env.NODE_ENV !== 'production') {
          return res.status(500).json({
            message: `No user found with id: "${req.params.id}", but id matches currently logged in user. Something went horribly wrong :(`,
          });
        } else {
          return res.sendStatus(500);
        }
      }
      req.session.destroy(() => res.sendStatus(204));
    } catch (err) {
      handleErr(err);
    }
  });
  return router;
};
