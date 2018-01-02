/*
  This module contains the controller for the user endpoint (.../users/).
  It contains functions to deal with requests to this endpoint.
*/

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
const authentication = require('app/controllers/authentication');
const userController = require('app/controllers/user');
const usageLogRouter = require('app/routes/api/users/usage-logs');
const authorisation = require('app/middleware/authorisation');

const userIdMatchesAuthenticatedUser = authorisation.authenticatedUserOwnsResource('userId');
// POST .../users/
// Used to add a user to the system
router.post('/', userController.newUser);
// TODO: Is this needed
router.get('/:userId', authentication.isUserAuthenticated, userIdMatchesAuthenticatedUser, userController.getUser);
//TODO: ONLY USED TO TEST AUTH. REMOVE FOR PROD.
router.get('/', authentication.isUserAuthenticated, userController.allUsers);

// Only allow client token authentication and ensure that the token is for the userId of the logs attempting to be accessed
router.use('/:userId/usage-logs', authentication.isBearerAuthenticated, userIdMatchesAuthenticatedUser, usageLogRouter);

module.exports = router;
