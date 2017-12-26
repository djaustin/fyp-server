/*
  This module contains the data model for clients in the application.
  It provides a representation of the schema of the mongodb documents.
  A client can be something like the Facebook web application or the Facebook mobile application.
  A client will access the API using OAuth2 bearer tokens and must therefore be authorized by a user.
*/

const mongoose = require('mongoose');

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
  }
});

// NOTE: Consider changing the code in commons/password.js so that it can be imported here to avoid the code reuse
ClientSchema.pre('save', function(callback){
  // Preserve 'this' as documentInstance object because it gets overridden in the bcrypt functions
  const documentInstance = this;

  // Exit function if the password has not been changed
  if(!documentInstance.isModified('secret')){
    return callback();
  }

  // Hash password with bcrypt using 10 salt rounds
  bcrypt.hash(documentInstance.secret, 10, function(err, hash){
    if(err){
      // Propagate error to callback if hashing failed
      callback(err);
    } else {
      // Change secret string to hashed secret
      documentInstance.secret = hash;
      callback();
    }
  });
});

ClientSchema.methods.verifySecret = function(secret, callback){
  bcrypt.compare(secret, this.secret, function(err, match){
    if (err){
      callback(err);
    } else {
      callback(null, match);
    }
  });
}
