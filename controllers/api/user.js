const router = require('express').Router();

module.exports = ({userSvc}, {auth}, handleErr) => {
  // GET / (get all users)
  router.get('/', async (_, res) => {
    try {
      const users = await userSvc.get();
      if (users.length < 1) return res.status(404).json({message: 'No users in database'});
      return res.json(users);
    } catch (err) {
      handleErr(err);
    }
  });

  // GET /1 (get one user)
  router.get('/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const user = await userSvc.get(id);
      if (!user) return res.status(404).json({message: `No user found with id: "${id}"`});
      return res.json(user);
    } catch (err) {
      handleErr(err);
    }
  });

  // POST / (create a user)
  router.post('/', auth.mustNotBeLoggedIn, async (req, res) => {
    try {
      const {username, password} = req.body;
      const user = await userSvc.create(username, password);
      req.session.save(() => {
        const {id, username} = user;
        req.session.user = user;
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
  router.post('/login', auth.mustNotBeLoggedIn, async (req, res) => {
    try {
      const {username, password} = req.body;
      if (!username || !password) return res.status(400).json({message: 'Missing required fields'});
      const login = await userSvc.login(username, password);
      if (!login.ok) {
        switch (login.error) {
          case 'NOT_FOUND':
            return res.status(404).json({message: `No user found with username: "${username}"`});
          case 'BAD_PASSWORD':
            return res.status(403).json({message: 'Invalid password.'});
        }
      }
      req.session.save(() => {
        req.session.user = login.user;
        req.session.isLoggedIn = true;
        return res.json({user: login.user, message: 'Login successful.'});
      });
    } catch (err) {
      handleErr(err);
    }
  });

  // POST /logout (logout)
  router.post('/logout', auth.mustBeLoggedIn, (req, res) => {
    req.session.destroy(() => res.sendStatus(204));
  });

  // PUT /1 (change a user)
  router.put('/:id', auth.mustOwnEndpoint, async (req, res) => {
    const {id} = req.params;
    try {
      const {username, password} = req.body;
      if (!username && !password) return res.status(400).json({message: 'Nothing to update'});
      const user = await userSvc.update(req.params.id, username, password);
      if (!user) return res.status(404).json({message: `No user found with id: "${id}"`});
      return res.status(200).json({message: 'Update successful', user});
    } catch (err) {
      handleErr(err);
    }
  });

  // DELETE /1 (delete a user)
  router.delete('/:id', auth.mustOwnEndpoint, async (req, res) => {
    const {id} = req.params;
    try {
      const user = await userSvc.delete(id);
      if (!user) {
        if (process.env.NODE_ENV !== 'production') {
          return res.status(500).json({
            message: `No user found with id: "${id}", but id matches currently logged in user. Something went horribly wrong :(`,
          });
        } else {
          return res.sendStatus(500);
        }
      }
      req.session.destroy(() => res.status(200).json({message: 'User deleted', user}));
    } catch (err) {
      handleErr(err);
    }
  });
  return router;
};
