/**
 *  This module contains the data model for clients in the application.
 *  It provides a representation of the schema of the mongodb documents.
 *  A client can be something like the Facebook web application or the Facebook mobile application.
 *  A client will access the API using OAuth2 bearer tokens and must therefore be authorized by a user.
 */

const AuthCode = require('app/models/code');
const AccessToken = require('app/models/accessToken');
const RefreshToken = require('app/models/refreshToken');
const mongoose = require('mongoose');
// cryptographic hashing library
const bcrypt = require('bcrypt');
// global logging instance
const logger = require('app/utils/logger');
const crypto = require('app/utils/crypto');

/**
 * Create the schema.
 * Name is the name of the client eg. Facebook iOS
 * id is the OAuth 2 client ID used to authenticate the client
 * secret is the OAuth2 client secret used to authenticate the client
 * applicationId refers to the application that owns the client
 * redirectUri is the uri used in the OAuth 2 exchanges
 * isThirdParty is used to distinguish between Digital Monitor clients and clients that will be sending usage logs
 * platform is a reference to the platform the client is used on eg. iOS, Android, Browser
 * usePushEach is required due to deprecated feature in mongodb being used by mongoose
 */
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
    ref: 'Application',
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
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Platform'
  }
});

/**
 * Function run before removing a client document. This cascades on delete, removing all auth codes, access tokens, refresh tokens, and usage logs
 */
ClientSchema.pre('remove', async function(next){
    try{
      // Remove all auth codes
      const authCodes = await AuthCode.find({clientId: this._id});
      await Promise.all(authCodes.map(e => e.remove()))
      // Remove all access tokens
      const accessTokens = await AccessToken.find({clientId: this._id});
      await Promise.all(accessTokens.map(e => e.remove()))
      // Remove all refesh tokens
      const refreshTokens = await RefreshToken.find({clientId: this._id});
      await Promise.all(refreshTokens.map(e => e.remove()))
      // Remove all usage logs
      const logs = await mongoose.model('UsageLog').find({clientId: this._id});
      await Promise.all(logs.map(e => e.remove()))
      next()
    } catch(err){
      next(err)
    }
  })
/**
 * Verify a secret by comparing it to the stored secret
 * @param secret {String} The plaintext secret to verify
 */
ClientSchema.methods.verifySecret = function(secret){
  return String(secret) === String(this.secret)
}

// Export the model created by this schema for use in other files
module.exports = mongoose.model('Client', ClientSchema);
