/**
 *  This module contains the data model for clients in the application.
 *  It provides a representation of the schema of the mongodb documents.
 *  A client can be something like the Facebook web application or the Facebook mobile application.
 *  A client will access the API using OAuth2 bearer tokens and must therefore be authorized by a user.
 */

const mongoose = require('mongoose');
// cryptographic hashing library
const bcrypt = require('bcrypt');
// global logging instance
const logger = require('app/utils/logger');
const crypto = require('app/utils/crypto');

const ClientSchema = new mongoose.Schema({
  name: {
    type:  String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  secret: {
    type: String,
    required: true
  },
  // Two-way reference breaks atomicity of reassigning the client but clients will not be reassigned.
  // This helps speed up querying the application from a clientId which will be retrieved from a log.
  applicationId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  redirectUri: {
    type: String,
    required: true
  },
  isThirdParty: {
    type: Boolean,
    required: true
  },
  platform : {
    type: String,
    required: true,
    enum: ['ios', 'android', 'blackberry', 'windows-phone', 'desktop', 'browser']
  }
});

/**
 * If the client secret has changed and the document is being saved, make sure the secret is hashed
 */
ClientSchema.pre('save', crypto.hashSecret('secret'));

/**
 * Verify a plaintext secret by hashing and comparing it to the stored hash
 * @param secret {String} The plaintext secret to verify
 */
ClientSchema.methods.verifySecret = crypto.verifySecret('secret');

// Export the model created by this schema for use in other files
module.exports = mongoose.model('Client', ClientSchema);
