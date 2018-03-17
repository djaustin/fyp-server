// User model for database interface
const User = require('app/models/user');
const logger = require('app/utils/logger');

/**
 * Add a new user to the database with the details provided
 * @param req {Object} Request object that holds the user details in req.body
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.newUser = async function(req, res, next){
  // Generate a new user document using the model
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    usageGoals: []
  });

  try{
    await user.save();
    // Set to undefined so we don't send it back to client
    user.password = undefined;
    // Respond with locations of created entity
    res.status(201);
    res.jsend.success({
      user: user,
      locations: [`https://digitalmonitor.tk/api/users/${user._id}`]
    });
  } catch(err){
    err.status = 400;
    next(err);
  }
};

/**
 * Get a single user from the database by id
 * @param req {Object} Request object containing the userId of the user to retrieve. This should be in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
 //NOTE: Is this even needed? Need to be careful about authentication if this is kept
exports.getUser = async function(req, res, next){
  try{
    const user = await User.findOne({_id: req.params.userId}, {password: 0}).populate('usageGoals.platform').populate('usageGoals.period');
    res.jsend.success({user: user});
  } catch(err){
    next(err);
  }
}

/**
 * Delete a user from the database by id
 * @param req {Object} Request object containing the userId of the user to delete in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.deleteUser = async function(req, res, next){
  try{
    await req.user.remove();
    res.jsend.success(null);
  } catch(err){
    next(err);
  }
}

/**
 * Edit user details of an authenticated and authorized user
 * @param req {Object} Request object containing the userId of the user to edit (req.params.userId) and the new details to save (req.body)
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.editUser = async function(req, res, next){
  try{
    if(req.body.email) req.user.email = req.body.email;
    if(req.body.firstName) req.user.firstName = req.body.firstName;
    if(req.body.lastName) req.user.lastName = req.body.lastName;
    if(req.body.password) req.user.password = req.body.password;
    await req.user.save()
    res.jsend.success(null);
  } catch(err){
    next(err);
  }
}

/**
 * Get users matching the query provided
 * @param req {Object} request object containing the query (req.query)
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getUsers = async function(req, res, next){
  try{
    var users
    if(!req.query){
      users = []
    } else {
      users = await User.find(req.query, {password: 0}).populate('usageGoals.platform').populate('usageGoals.period').populate('usageGoals.application')
    }
    res.jsend.success({users: users})
  } catch(err){
    next(err);
  }
};
