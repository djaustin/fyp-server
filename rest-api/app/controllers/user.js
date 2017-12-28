// User model for database interface
const User = require('app/models/user');

exports.newUser = function(req, res){
  console.log('Entering newUser controller');
  // Generate a new user document using the model
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  console.log('New user instance created in memory');

  // Attempt to save the user to the mongodb database
  user.save(function(err){
    console.log('Entering user.save callback');
    if(err){
      console.log('Error occured on save');
      // Send error back to client
      // NOTE: Consider changing this behaviour for security. IT RETURNS THE PASSWORD OF THE USER YOU TRIED TO CREATE
      res.send(err);
    } else {
      console.log('No error occured on save');
      // Respond with location of created entity
      res.status(201);
      res.json({
        location: `https://digitalmonitor.tk/api/users/${user._id}`
      });
      console.log('Response sent');
    }
  });
};

exports.getUser = function(req, res){
  User.find({_id: req.params.userId}, '_id email firstName lastName', function(err, user){
    if(err){
      res.send(err);
    } else {
      res.json(user);
    }
  })
}

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
