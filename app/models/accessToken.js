/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * An access token allows a client application to access the api on behalf of an authorizing user
 */
const mongoose = require('mongoose');

/**
 * Create the schema.
 * Value is the actual access token that will be used for authentication
 * userId relates to the user to whose account this provides authorisation. This can be null if the access token does not provide any user access.
 * clientId relates to the client for which this access token provides access.
 * expiresAt is used in conjunction with a collection index in mongodb to automatically delete the access tokens when the expiry time is passed
 */
const AccessTokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
  },
  clientId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Ensure that Tokens expire after their expiresAt field
AccessTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);
