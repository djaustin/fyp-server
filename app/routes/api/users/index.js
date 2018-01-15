/*
  This module manages routes for the users endpoint.
*/

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import request controllers
const userController = require('app/controllers/user');
// Import authentication module to restrict access to certain endpoints
const authentication = require('app/controllers/authentication');
// Import nested routers
const usageLogRouter = require('app/routes/api/users/usage-logs');
const clientsRouter = require('app/routes/api/users/clients');

// Middleware that checks whether the user id of the authenticated user is the same as the userId in the URL being requested.
// This prevents the case where an authenticated user can access any other user's details
const authorisation = require('app/middleware/authorisation');
const userIdMatchesAuthenticatedUser = authorisation.authenticatedUserOwnsResource('userId');


router.route('/:userId')
  /**
   * Get a user by their id. The user must be authenticated and and only access their own details
   */
  .get(authentication.isUserAuthenticated, userIdMatchesAuthenticatedUser, userController.getUser)
  /**
   * Delete a user by their id. The user must be authenticated and and only access their own details
   */
  .delete(authentication.isUserAuthenticated, userIdMatchesAuthenticatedUser, userController.deleteUser)
  /**
   * Delete a user by their id. The user must be authenticated and and only access their own details
   */
  .patch(authentication.isUserAuthenticated, userIdMatchesAuthenticatedUser, userController.editUser);


router.use('/:userId/clients', authentication.isUserAuthenticated, userIdMatchesAuthenticatedUser, clientsRouter);

router.route('/')
  //TODO: ONLY USED TO TEST AUTH. REMOVE FOR PROD.
  // Get all user details. Must be logged in
  .get(authentication.isClientBearerAuthenticated, userController.getUsers)
  /**
   * Add a new user.
   */
  .post(authentication.isClientBearerAuthenticated, userController.newUser);

/**
 * Mount the nested router onto this endpoint. Only accessible via OAuth2 token
 */
router.use('/:userId/usage-logs', authentication.isUserAuthenticated, userIdMatchesAuthenticatedUser, usageLogRouter);


module.exports = router;
