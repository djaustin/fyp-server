/*
  This module manages routes for the users endpoint.
*/

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import request controllers
const userController = require('app/controllers/user');
// Import authentication module to restrict access to certain endpoints
const authentication = require('app/controllers/authentication');
// Import nested router
const usageLogRouter = require('app/routes/api/users/usage-logs');

// Middleware that checks whether the user id of the authenticated user is the same as the userId in the URL being requested.
// This prevents the case where an authenticated user can access any other user's details
const authorisation = require('app/middleware/authorisation');
const userIdMatchesAuthenticatedUser = authorisation.authenticatedUserOwnsResource('userId');

/**
 * Add a new user.
 */
router.post('/', userController.newUser);

/**
 * Get a user by their id. The user must be authenticated and and only access their own details
 */
router.get('/:userId', authentication.isUserAuthenticated, userIdMatchesAuthenticatedUser, userController.getUser);

//TODO: ONLY USED TO TEST AUTH. REMOVE FOR PROD.
// Get all user details. Must be logged in
router.get('/', authentication.isUserAuthenticated, userController.allUsers);

/**
 * Mount the nested router onto this endpoint. Only accessible via OAuth2 token
 */
router.use('/:userId/usage-logs', authentication.isBearerAuthenticated, userIdMatchesAuthenticatedUser, usageLogRouter);


module.exports = router;
