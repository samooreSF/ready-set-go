let User = require('./models/User');

async function loadUser(req, res, next) {
  let userId = req.session.userId;

  res.locals.user = null;

  if (userId) {
    req.user = await User.query().findById(userId);
    res.locals.user = req.user;
  }

  next();
}

module.exports = loadUser;
