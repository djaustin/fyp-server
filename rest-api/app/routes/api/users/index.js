/*
  This module contains the controller for the user endpoint (.../users/).
  It contains functions to deal with requests to this endpoint.
*/

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
const authentication = require('app/controllers/authentication');
const userController = require('app/controllers/user');

// POST .../users/
// Used to add a user to the system
router.post('/', userController.newUser);
router.get('/:userId', userController.getUser);
//NOTE: ONLY USED TO TEST AUTH. REMOVE FOR PROD.
router.get('/', authentication.isUserAuthenticated, userController.allUsers);

module.exports = router;
