const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const logger = require('app/utils/logger');

const User = require('app/models/user');
const Organisation = require('app/models/organisation');
const Client = require('app/models/client');
const Token = require('app/models/accessToken');

passport.use('organisation-basic', new BasicStrategy({passReqToCallback: true},
  async function(req, email, password, callback){
    try{
      const organisation = await Organisation.findOne({email: email});
      if(!organisation) return callback(null, false);
      const match = await organisation.verifyPassword(password);
      if(match){
        // req.user and req.organisation both point to the authenticated organisation
        req.organisation = organisation;
        return callback(null, organisation);
      } else {
        return callback(null, false);
      }
    }catch(err){
      logger.error(err);
      return callback(err);
    }
  }
));

/**
 * Generate an authentications strategy that authenticates a client by checking the provided client id and client secret against the database documents
 */
passport.use('client-basic', new BasicStrategy(
  async function(id, secret, callback){
    try{
      // Attempt to find client by Id in database
      const client = await Client.findOne({id: id});
      // If no client is found, reject authentication
      if(!client) return callback(null, false);
      // Attempt to verify the client secret (password)
      const match = await client.verifySecret(secret);
      // Return client object to callback if secret is verified else reject auth
      if(match){
        return callback(null, client);
      } else {
        return callback(null, false)
      }
    } catch(err){
      logger.error(err);
      callback(err);
    }
  }
));

// Allow authentication of requests made by applications on behalf of users
passport.use('user-bearer', new BearerStrategy({passReqToCallback: true},
  async function(req, accessToken, callback){
    try{
      // Find a token with a value matching the one provided
      const token = await Token.findOne({value: accessToken});
      // Reject auth if token not found
      if(!token) return callback(null, false);

      // Get the user and client objects from their respective IDs in parallel
      const [user, client] = await Promise.all([
        User.findOne({_id: token.userId}),
        Client.findOne({_id: token.clientId})
      ]);

      // Reject auth if no user or no client found
      if(!user || !client) return callback(null, false);

      // Add authenticated client to the request object
      req.client = client;
      // Allow all scopes. TODO: Is this actually going to be used
      return callback(null, user, {scope: '*'});

    } catch(err){
      logger.error(err);
      callback(err);
    }
  }
));

// Allow authentication of requests made by client with no user authorization (eg. register a new user or organisation);
passport.use('client-bearer', new BearerStrategy({passReqToCallback: true},
  async function(req, accessToken, callback){
    try{
      // Find a token with a value matching the one provided
      const token = await Token.findOne({value: accessToken});
      // Reject auth if token not found
      if(!token) return callback(null, false);

      // Get the user and client objects from their respective IDs in parallel
      const client = await Client.findOne({_id: token.clientId});

      // Reject auth if no user or no client found
      if(!client) return callback(null, false);

      // Add authenticated client to the request object
      req.client = client;
      // Allow all scopes. TODO: Is this actually going to be used
      return callback(null, client, {scope: '*'});

    } catch(err){
      logger.error(err);
      callback(err);
    }
  }
));

passport.use(new LocalStrategy(async function(email, password, callback){
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
}));


// Export authentication for easier use when module is imported
exports.isUserAuthenticated = passport.authenticate('user-bearer', {session: false, failWithError: true});
exports.isOrganisationAuthenticated = passport.authenticate('organisation-basic', {session: false, failWithError: true});
exports.isClientSecretAuthenticated = passport.authenticate('client-basic', {session: false, failWithError: true});
exports.isClientBearerAuthenticated = passport.authenticate('client-bearer', {session: false, failWithError: true});