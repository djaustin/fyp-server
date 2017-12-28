
// Allow authentication of users with basic auth (username and password)
// NOTE: Make sure HTTPS is used or this is silly.
/**
 * Generate an authentication strategy to be used by passport on requests.
 * This middleware authenticates a 'User' by checking the provided email and password against the database documents.
 * 'user-basic' is the name of the authentication strategy we are generating
 */
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

const User = require('app/models/user');
const Organisation = require('app/models/organisation');

passport.use('user-basic', new BasicStrategy(
  async function(email, password, callback){
    try{
      const user = await User.findOne({email: email});
      if (!user) return callback(null, false);
      const match = await user.verifyPassword(password);
      if(match){
        return callback(null, user);
      } else {
        return callback(null, false);
      }
    } catch(err){
      return callback(err);
    }

    // User.findOne({email: email}, function (err, user){
    //   // Return the error if one occurs during query
    //   if(err) return callback(err);
    //
    //   // Report credentials as invalid if no user is found with that email
    //   if(!user) return callback(null, false);
    //
    //   // If a user is found with no errors, verify the password provided against the one stored in the database.
    //   user.verifyPassword(password, function(err, match){
    //     // Return the error if one occurs during password verification
    //     if(err) return callback(err);
    //     if(match){
    //       // Email and password match, return the user object to be used in further requests (req.user)
    //       return callback(null, user);
    //     } else {
    //       // Password is incorrect, report invalid credentials
    //       return callback(null, false);
    //     }
    //   });
    // });
  }
));

passport.use('organisation-basic', new BasicStrategy(
  async function(email, password, callback){
    try{
      console.log('Finding organisation with email ' + email);
      const organisation = await Organisation.findOne({email: email});
      console.log('Organisation found: ', organisation);
      if(!organisation) return callback(null, false);
      console.log('Verifying password of organisation');
      const match = await organisation.verifyPassword(password);
      if(match){
        console.log('Password matches');
        return callback(null, organisation);
      } else {
        console.log('Password does not match');
        return callback(null, false);
      }
    }catch(err){
      console.log('Error during async calls');
      return callback(err);
    }
  }

  //   Organisation.findOne({email: email}, function (err, organisation){
  //     // Return the error if one occurs during query
  //     if(err) return callback(err);
  //
  //     // Report credentials as invalid if no organisation is found with that email
  //     if(!organisation) return callback(null, false);
  //
  //     // If an organisation is found with no errors, verify the password provided against the one stored in the database.
  //     organisation.verifyPassword(password, function(err, match){
  //       // Return the error if one occurs during password verification
  //       if(err) return callback(err);
  //       if(match){
  //         // Email and password match, return the organisation object to be used in further requests (req.user)
  //         return callback(null, organisation);
  //       } else {
  //         // Password is incorrect, report invalid credentials
  //         return callback(null, false);
  //       }
  //     });
  //   });
  // }
));

// Export authentication for easier use when module is imported
exports.isUserAuthenticated = passport.authenticate('user-basic', {session: false});
exports.isOrganisationAuthenticated = passport.authenticate('organisation-basic', {session: false});
