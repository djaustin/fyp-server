/*
  This module contains the controller for the user endpoint (.../users/).
  It contains functions to deal with requests to this endpoint.
*/

// Import and initialize new express router
const router = require('express').Router();

// Import user model
const User = require('../models/user');

// POST .../users/
// Used to add a user to the system
router.post('/', function(req, res){
  // Generate a new user document using the model
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  // Attempt to save the user to the mongodb database
  user.save(function(err){
    if(err){
      // Send error back to client
      // NOTE: Consider changing this behaviour for security
      res.send(err);
    } else {
      res.json({
        message: 'New user added successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    }
  });
});

// Return all user details
// NOTE: REMOVE THIS OBVIOUS SECURITY HOLE LATER
router.get('/', function(req, res){
  User.find(function(err, users){
    if(err){
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

module.exports = router;
