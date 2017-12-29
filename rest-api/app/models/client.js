/*
  This module contains the data model for clients in the application.
  It provides a representation of the schema of the mongodb documents.
  A client can be something like the Facebook web application or the Facebook mobile application.
  A client will access the API using OAuth2 bearer tokens and must therefore be authorized by a user.
*/

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//TODO: Consider checking the format of these fields before allowing saves
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
  }
});

// NOTE: Consider changing the code in commons/password.js so that it can be imported here to avoid the code reuse
ClientSchema.pre('save', async function(callback){
  // Exit function if the password has not been changed
  if(!this.isModified('secret')){
    return callback();
  }
  try{
    // Hash password with bcrypt using 10 salt rounds
    const hash = bcrypt.hash(this.secret, 10);
    // Change secret string to hashed secret
    this.secret = hash;
    callback();
  } catch(err){
    callback(err);
  }
});

ClientSchema.methods.verifySecret = function(secret){
  new Promise(async function(resolve, reject){
    try{
      const match = await bcrypt.compare(secret, this.secret);
      resolve(match);
    } catch(err){
      reject(err);
    }
  });
};

module.exports = mongoose.model('Client', ClientSchema);
