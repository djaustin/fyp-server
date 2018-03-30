/**
 * Controller to manage the handling of requests for the login page
 */

const passport = require('passport');

/**
* Retrieve the login page
* @param req {Object} Request object
* @param res {Object} Response parameter with which to send result to client
*/
exports.getLoginPage = function(req, res) {
  res.render('login');
};

/**
 * Handle submission of login form. Pass request to passport local authentication strategy.
 * Show the root page if successful and redirect back to the login page on failure
 * @param req {Object} Request object containing login details
 * @param res {Object} Response parameter with which to send result to client
 */
exports.postLoginPage = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });
