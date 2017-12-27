/*
  This module contains the controller for the user endpoint (.../users/).
  It contains functions to deal with requests to this endpoint.
*/

// Import and initialize new express router
const router = require('express').Router();
const authentication = require('../../controllers/authentication');
const userController = require('../../controllers/user');

// POST .../users/
// Used to add a user to the system
router.post('/', userController.newUser);
//NOTE: ONLY USED TO TEST AUTH. REMOVE FOR PROD.
router.get('/', authentication.isUserAuthenticated, userController.allUsers);

module.exports = router;
