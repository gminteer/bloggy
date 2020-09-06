const router = require('express').Router();

function handleErr(req, res, err) {
  console.error(err);
  if (
    err.name &&
    ['SequelizeUniqueConstraintError', 'SequelizeValidationError'].includes(err.name)
  ) {
    const errors = err.errors.map((error) => {
      const {instance: _, ...sanitizedError} = error;
      return sanitizedError;
    });
    return res.status(422).json(errors);
  }
  if (process.env.NODE_ENV !== 'production') return res.status(500).json(err);
  else return res.sendStatus(500);
}

module.exports = (services) => {
  router.use('/users', require('./user')(services, handleErr));
  router.use('/posts', require('./post')(services, handleErr));
  return router;
};
