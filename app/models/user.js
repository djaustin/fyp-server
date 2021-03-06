/**
 *  This module contains the data model for users in the application.
 *  It provides a representation of the schema of the mongodb documents.
*/

// Mongodb interface
const mongoose = require('mongoose');
const AuthCode = require('app/models/code');
const AccessToken = require('app/models/accessToken');
const RefreshToken = require('app/models/refreshToken');
const MonitoringException = require('app/models/monitoring-exception');
// Password hashing
const crypto = require('app/utils/crypto');
const UsageGoalSchema = require('app/models/usage-goal').schema;

/**
 * Create the schema.
 * email is the user's email used as a unique username
 * password is the password used to authenticate the user
 * firstName is the user's first name
 * lastName is the user's last name
 * uageGoals is an array of subdocuments containing all the user's usage goals
 * usePushEach is required due to deprecated feature in mongodb being used by mongoose
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  usageGoals: [UsageGoalSchema]
}, {usePushEach: true});

/**
 * Function run before removing a user document. This cascades on delete, removing all auth codes, access tokens, refresh tokens, monitoring exceptions, and usage logs
 */
UserSchema.pre('remove', async function(next){
    try{
      // Remove all auth codes
      const authCodes = await AuthCode.find({userId: this._id});
      await Promise.all(authCodes.map(e => e.remove()))
      // Remove all access tokens
      const accessTokens = await AccessToken.find({userId: this._id});
      await Promise.all(accessTokens.map(e => e.remove()))
      // Remove all refesh tokens
      const refreshTokens = await RefreshToken.find({userId: this._id});
      await Promise.all(refreshTokens.map(e => e.remove()))
      // Remove all monitoring exceptions
      const exceptions = await MonitoringException.find({user: this._id});
      await Promise.all(exceptions.map(e => e.remove()))
      // Remove all usage logs
      const logs = await mongoose.model('UsageLog').find({userId: this._id});
      await Promise.all(logs.map(e => e.remove()))
      next()
    } catch(err){
      next(err)
    }
  })

// Define action to complete before saving a document.
// Here we make sure that every password is hashed before placing it in the database
UserSchema.pre('save', crypto.hashSecret('password'));

// Instance method to facilitate password verification.
UserSchema.methods.verifyPassword = crypto.verifySecret('password');

// Create a model as a programming interface with mogodb, specify the collection name 'User' and the schema 'UserSchema'
module.exports = mongoose.model('User', UserSchema);
