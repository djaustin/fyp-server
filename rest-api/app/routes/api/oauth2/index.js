/**
 * This module manages routes for OAuth2 nested routes
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import authentication to restrict access to certain URLs
const authentication = require('app/controllers/authentication');
// Import request controller
const oauth2Controller = require('app/controllers/oauth2');
// Import nested routers
const authorizeRouter = require('app/routes/api/oauth2/authorize');
const tokenRouter = require('app/routes/api/oauth2/token');

// Routes to request permission from the user to access the API on their behalf
router.use('/authorize', authentication.isUserAuthenticated, authorizeRouter);

// Route to exchange an authorization code for an access token
router.use('/token', authentication.isClientAuthenticated, tokenRouter);

module.exports = router;
