
// Allow authentication of users with basic auth (username and password)
// NOTE: Make sure HTTPS is used or this is silly.
/**
 * Generate an authentication strategy to be used by passport on requests.
 * This middleware authenticates a 'User' by checking the provided email and password against the database documents.
 * 'user-basic' is the name of the authentication strategy we are generating
 */
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const logger = require('app/utils/logger');

const User = require('app/models/user');
const Organisation = require('app/models/organisation');
const Client = require('app/models/client');
const Token = require('app/models/token');

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
  }
));

passport.use('organisation-basic', new BasicStrategy(
  async function(email, password, callback){
    try{
      logger.debug('Finding organisation with email ' + email);
      const organisation = await Organisation.findOne({email: email});
      logger.debug('Organisation found: ', organisation);
      if(!organisation) return callback(null, false);
      logger.debug('Verifying password of organisation');
      const match = await organisation.verifyPassword(password);
      if(match){
        logger.debug('Password matches');
        return callback(null, organisation);
      } else {
        logger.debug('Password does not match');
        return callback(null, false);
      }
    }catch(err){
      logger.error(err);
      return callback(err);
    }
  }
));

passport.use('client-basic', new BasicStrategy(
  async function(id, secret, callback){
    try{
      // Attempt to find client by Id in database
      const client = await Client.findOne({id: id});
      // If no client is found, reject authentication
      if(!client) return callback(null, false);
      // Attempt to verify the client secret (password)
      const match = await client.verifySecret(secret);
      logger.debug('authentication.js match?', match);
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
passport.use(new BearerStrategy(
  async function(accessToken, callback){
    try{
      // Find a token with a value matching the one provided
      const token = await Token.findOne({value: accessToken});
      logger.debug('Got token', token);
      // Reject auth if token not found
      if(!token) return callback(null, false);

      // Get the user and client objects from their respective IDs in parallel
      const [user, client] = await Promise.all([
        User.findOne({_id: token.userId}),
        Client.findOne({_id: token.clientId})
      ]);
      logger.debug('User', user, 'Client', client);

      // Reject auth if no user or no client found
      if(!user || !client) return callback(null, false);

      // HACK: bundle the two documents into one so they can both be accessed by request handlers
      const authenticatedEntities = {
        user: user,
        client: client
      }
      logger.debug('Returning user object', user);
      // Allow all scopes. TODO: Is this actually going to be used
      return callback(null, authenticatedEntities, {scope: '*'});

    } catch(err){
      logger.error(err);
      callback(err);
    }
  }
));

// Export authentication for easier use when module is imported
exports.isUserAuthenticated = passport.authenticate('user-basic', {session: false});
exports.isOrganisationAuthenticated = passport.authenticate('organisation-basic', {session: false});
exports.isClientAuthenticated = passport.authenticate('client-basic', {session: false});
exports.isBearerAuthenticated = passport.authenticate('bearer', {session: false})
