/**
 * This module mananges routes for the oauth2/authorize endpoints
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import request controller
const oauth2Controller = require('app/controllers/oauth2');

/**
 * GET presents the user with a dialog asking if they authorize the application
 * POST has the server process the users decision and issue an authorization code if granted
 */
router.route('/')
  .get(oauth2Controller.authorization)
  .post(oauth2Controller.decision);

module.exports = router;
