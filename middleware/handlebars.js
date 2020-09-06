module.exports = {
  sessionLocals(req, res, next) {
    res.locals.session = req.session;
    next();
  },
};
