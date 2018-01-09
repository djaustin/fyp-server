const passport = require('passport');

exports.getLoginPage = function(req, res) {
  res.render('login');
};

exports.postLoginPage = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });
