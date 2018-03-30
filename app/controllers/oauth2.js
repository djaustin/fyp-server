const oauth2orize = require('oauth2orize');
const uid = require('uid2');

const logger = require('app/utils/logger');

const User = require('app/models/user');
const Client = require('app/models/client');
const AccessToken = require('app/models/accessToken');
const Code = require('app/models/code');
const RefreshToken = require('app/models/refreshToken');
const Organisation = require('app/models/organisation');
const config = require('../../config/config');

// This instance exposes config options and middleware that will be used in routes
const server = oauth2orize.createServer();

// TTL of the access tokens provided by this server in seconds
const accessTokenLifetime = config.accessTokenLifetime;

/**
 * Generates an access token and refresh token
 * @param clientId {String} ID of client owning the tokens
 * @param userId {String} ID of user owning the tokens
 * @param generateRefreshToken {Boolean} Whether or not to generate a refresh token alongside an access token. True by default
 */
async function generateTokens(clientId, userId, generateRefreshToken = true){

  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + accessTokenLifetime * 1000);

  try{

    const accessToken = new AccessToken({
      value: uid(256),
      clientId: clientId,
      userId: userId,
      expiresAt: expiryDate
    });

    if(generateRefreshToken){

      const refreshToken = new RefreshToken({
        value: uid(256),
        clientId: clientId,
        userId: userId
      });

      await Promise.all([refreshToken.save(), accessToken.save()]);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      };

    } else {

      await accessToken.save();

      return {accessToken: accessToken};

    }
  } catch (err){

    throw err;

  }
}


// Obtaining the user's authorization involves multiple request/response pairs.
// During this time, an OAuth 2.0 transaction will be serialized to the session.
// Part of this requires the client to be serialized in the session. We will just use the client ID.
server.serializeClient(function(client, callback){
  return callback(null, client._id);
});

server.deserializeClient(async function(id, callback){
  try{
    const client = await Client.findOne({_id: id});
    callback(null, client);
  } catch(err){
    logger.error(err);
    callback(err);
  }
});

// A grant is the permission obtained by the client from the user before it is issued an access token.
// Generate the middleware for granting authorization codes
// Given a client, redirectUri, user, authorizationResponse (user's decision after being prompted)
// NOTE: oauth2orize.grant.code specifies that we are granting an authorization code as opposed to implicit, exchange, or username/password
server.grant(oauth2orize.grant.code(async function(client, redirectUri, user, authorizationResponse, callback){
  // Create a new Code object from mongoose model
  const code = new Code({
    value: uid(256),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  });

  // Save the code object and return the code value to the callback
  try{
    await code.save();
    callback(null, code.value);
  } catch(err){
    logger.error(err);
    callback(err);
  }

}));

// Add 'Resource Owner Credentials' exchange type to allow exchange of access token for an authenticated client and user credentials
server.exchange(oauth2orize.exchange.password(async function(client, email, password, callback) {
  try{
    // Try to find user with given email
    const user = await User.findOne({email: email});
    // If no user matches, check if organisation exists
    if(!user) {
      const organisation = await Organisation.findOne({email: email});
      if (!organisation){
        return callback(null, false);
      }
      const match = await organisation.verifyPassword(password);
      if(!match) return callback(null, false);
      const tokens = await generateTokens(client._id, organisation._id);

      callback(null, tokens.accessToken.value, tokens.refreshToken.value, {expires_in: accessTokenLifetime});
    } else {
      // Verify the provided password agains the one in the database
      const match = await user.verifyPassword(password);
      // If the passwords do not match then reject exchange
      if(!match) return callback(null, false);

      const tokens = await generateTokens(client._id, user._id);

      // Return access token to the callback
      callback(null, tokens.accessToken.value, tokens.refreshToken.value, {expires_in: accessTokenLifetime});
    }
  } catch (err){
    logger.error(err);
    callback(err);
  }
}));

// Add 'Client Credentials' exchange type to allow exchange of access token for an authenticated client. This does not allow the client to access any user details as no user is attached to the token
server.exchange(oauth2orize.exchange.clientCredentials(async function(client, callback) {
  try{

    const tokens = await generateTokens(client._id, null);

    // Return access accessToken to the callback
    callback(null, tokens.accessToken.value, tokens.refreshToken.value, {expires_in: accessTokenLifetime});
  } catch (err){
    logger.error(err);
    callback(err);
  }
}));

// Add 'Authorisation Code' exchange type to allow exchange of access token for a client's authorisation code.
server.exchange(oauth2orize.exchange.code(async function(client, code, redirectUri, callback){
  try{
    // Attempt to find authorization code with provided value in the database
    const authCode = await Code.findOne({value: code});

    // If no code matching the supplied value is found, return false in callback to represent invalid auth code
    if(!authCode) return callback(null, false);

    // If the code is for a different client then return false in callback to represent invalid auth code
    if(client._id.toString() !== authCode.clientId) return callback(null, false);

    // If redirect URI is different, report invalid auth code
    if(redirectUri !== authCode.redirectUri) return callback(null, false);

    // Remove authCode now that it is used
    await authCode.remove();

    const tokens = await generateTokens(authCode.clientId, authCode.userId);

    // Return access accessToken to the callback
    callback(null, tokens.accessToken.value, tokens.refreshToken.value, {expires_in: accessTokenLifetime});

  } catch(err){
    logger.error(err);
    callback(err);
  }
}));

// Allow valid refresh tokens to be exchanged for a new access token
server.exchange(oauth2orize.exchange.refreshToken(async function(client, refreshAccessToken, callback){
  try{
    // Search for the refresh token
    const refreshToken = await RefreshToken.findOne({value: refreshAccessToken, clientId: client._id});
    if(!refreshToken) return callback(refreshToken);
    const tokens = await generateTokens(refreshToken.clientId, refreshToken.userId, false);
    callback(null, tokens.accessToken.value, refreshToken.value, {expires_in: accessTokenLifetime});
  } catch(err){
    logger.error(err);
    callback(err);
  }
}));

// Endpoint to initialise new authorization transactions
exports.authorization = [
  // The function argument here is used to get a client instance for the clientid making the request
  server.authorization(async function(clientId, redirectUri, callback){
    try{
      const client = await Client.findOne({id: clientId});
      // Make sure there is a client with that ID
      if(!client) return callback(null, false);
      // Make sure that the supplied redirectUri is the same as the one registered with the client in the database
      if(client.redirectUri !== redirectUri) return callback(null, false);
      return callback(null, client, redirectUri);
    } catch(err){
      logger.error(err);
      callback(err);
    }
  }),
  function(req, res){
    res.render('dialog', {transactionId: req.oauth2.transactionID, user: req.user, client: req.oauth2.client});
  }
];

// Endpoint to handle when the user grants or denies access to their account to the requesting application client
exports.decision = [
  // This handles data submitted in the POST request sent after the user accepts or denies access to their account.
  // If the user grants access, this calls the server.grant function created above.
  server.decision()
];

// Endpoint to handle the request made by the application client after they have been granted an authorization code by the user.
exports.token = [
  // Will initiate a call to server.exchange()
  server.token()
];
