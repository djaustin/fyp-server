/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A refresh token is used by a client to get a new access token if their initial token expired
 */
const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  // TODO: Consider hashing this
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
