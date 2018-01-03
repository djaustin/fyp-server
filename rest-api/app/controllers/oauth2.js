const oauth2orize = require('oauth2orize');
const uid = require('uid2');

const logger = require('app/utils/logger');

const User = require('app/models/user');
const Client = require('app/models/client');
const Token = require('app/models/token');
const Code = require('app/models/code');


// This instance exposes config options and middleware that will be used in routes
const server = oauth2orize.createServer();

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
    value: uid(16),
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

// TODO: Check these values for null
server.exchange(oauth2orize.exchange.code(async function(client, code, redirectUri, callback){
  try{
    const authCode = await Code.findOne({value: code});

    // If no code matching the supplied value is found, return false in callback to represent invalid auth code
    if(!authCode) return callback(null, false);

    // If the code is for a different client then return false in callback to represent invalid auth code
    if(client._id.toString() !== authCode.clientId) return callback(null, false);

    // If redirect URI is different, report invalid auth code
    if(redirectUri !== authCode.redirectUri) return callback(null, false);

    // Remove authCode now that it is used
    await authCode.remove();

    // Create a new access token
    const token = new Token({
      value: uid(256),
      clientId: authCode.clientId,
      userId: authCode.userId
    });

    // Save token to database.
    await token.save();

    // Return access token to the callback
    callback(null, token);

  } catch(err){
    logger.error(err);
    callback(err);
  }
}));

// Endpoint to initialise new authorization transactions
// TODO: Ensure that user has logged in
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
  server.token(),
  server.errorHandler()
];
