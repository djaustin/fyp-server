/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * An access token allows a client application to access the api on behalf of an authorizing user
 */
const mongoose = require('mongoose');

const AccessTokenSchema = new mongoose.Schema({
  // TODO: Consider hashing this
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
