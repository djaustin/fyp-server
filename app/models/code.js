/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A code is the authorization code given to the client by the auth server if a user authorizes the client application on their account.
 * The code can be later exchanged for an access token which can be used with bearer auth to access the user's account
 */

const mongoose = require('mongoose');
const crypto = require('app/utils/crypto');

const CodeSchema = new mongoose.Schema({
  // NOTE: Consider hashing this
  value: {
    type: String,
    required: true
  },
  // Used to add addiitional security when checking that the token exchange is legitimate
  redirectUri: {
    type: String,
    required: true,
  },
  // Which user and client own this code
  userId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true
  }
});

// Export the model created by this schema for use in other files
module.exports = mongoose.model('Code', CodeSchema);
