/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * An access token allows a client application to access the api on behalf of an authorizing user
 */
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  // TODO: Hash this
  value: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Token', TokenSchema);
