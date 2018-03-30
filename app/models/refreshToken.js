/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A refresh token is used by a client to get a new access token if their initial token expired
 */
const mongoose = require('mongoose');

/**
 * Create the schema.
 * Value is the actual refresh token value
 * userId is the ID of the user for which the token provides authorisation
 * clientId is the ID of the client that owns the refresh token
 */
const RefreshTokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  userId: {
    type: String
  },
  clientId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
