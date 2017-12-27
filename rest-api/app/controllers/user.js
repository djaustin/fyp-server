// User model for database interface
const User = require('app/models/user');

exports.newUser = function(req, res){
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
      // NOTE: Consider changing this behaviour for security. IT RETURNS THE PASSWORD OF THE USER YOU TRIED TO CREATE
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
};

exports.allUsers = function(req, res){
  User.find(function(err, users){
    if(err){
      res.send(err);
    } else {
      res.json({
        message: `Request received by ${req.user.email}`,
        users: users
      });
    }
  });
};
