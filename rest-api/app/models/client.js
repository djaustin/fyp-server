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
  },
  redirectUri: {
    type: String,
  }
});

// NOTE: Consider changing the code in commons/password.js so that it can be imported here to avoid the code reuse
ClientSchema.pre('save', async function(callback){
  // Exit function if the password has not been changed
  console.log('Entering pre save client function');
  if(!this.isModified('secret')){
    console.log('Secret not modified, returning');
    return callback();
  }
  try{
    console.log('Secret modified');
    // Hash password with bcrypt using 10 salt rounds
    const hash = await bcrypt.hash(this.secret, 10);
    // Change secret string to hashed secret
    this.secret = hash;
    callback();
  } catch(err){
    callback(err);
  }
});

ClientSchema.methods.verifySecret = function(secret){
  const client = this;
  return new Promise(async function(resolve, reject){
    try{
      console.log(client, secret);
      const match = await bcrypt.compare(secret, client.secret);
      console.log('client.js match?', match);
      resolve(match);
    } catch(err){
      reject(err);
    }
  });
};

module.exports = mongoose.model('Client', ClientSchema);
