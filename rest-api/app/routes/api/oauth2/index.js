const router = require('express').Router({mergeParams: true});
const authentication = require('app/controllers/authentication');
const oauth2Controller = require('app/controllers/oauth2');

// Routes to request permission from the user to access the API on their behalf
router.route('/authorize')
  .get(authentication.isUserAuthenticated, oauth2Controller.authorization)
  .post(authentication.isUserAuthenticated, oauth2Controller.decision);

// Route to exchange an authorization code for an access token
router.route('/token')
  .post(authentication.isClientAuthenticated, oauth2Controller.token);

module.exports = router;
