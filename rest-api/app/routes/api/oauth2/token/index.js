/**
 * This module mananges routes for the oauth2/authorize endpoints
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import request controller
const oauth2Controller = require('app/controllers/oauth2');

/**
 * Token exchange endpoint
 */
router.post('/', oauth2Controller.token);

module.exports = router;
