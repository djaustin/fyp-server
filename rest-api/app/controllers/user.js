// User model for database interface
const User = require('app/models/user');

/**
 * Add a new user to the database with the details provided
 * @param req Request object that holds the user details in req.body
 */
exports.newUser = async function(req, res){
  // Generate a new user document using the model
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  try{
    await user.save();
    // Set to undefined so we don't send it back to client
    user.password = undefined;
    // Respond with location of created entity
    res.status(201);
    res.json({
      user: user,
      location: `https://digitalmonitor.tk/api/users/${user._id}`
    });
  } catch(err){
    // Send error back to client
    // NOTE: Consider changing this behaviour for security. IT RETURNS THE PASSWORD OF THE USER YOU TRIED TO CREATE
    res.send(err);
  }
};

/**
 * Get a single user from the database by id
 * @param req Request object containing the userId of the user to retrieve. This should be in req.params
 */
 //NOTE: Is this even needed? Need to be careful about authentication if this is kept
exports.getUser = async function(req, res){
  try{
    const user = await User.findOne({_id: req.params.userId}, {password: 0});
    res.json(user);
  } catch(err){
    res.send(err);
  }
}

//TEMP: Only here for testing
exports.allUsers = async function(req, res){
  try{
    const users = await User.find();
    res.json({
      message: `Request received by ${req.user.email}`,
      users: users
    });
  } catch(err){
    res.send(err);
  }
};
