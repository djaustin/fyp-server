/*
  This module contains the data model for users in the application.
  It provides a representation of the schema of the mongodb documents.
*/
// Mongodb interface
const mongoose = require('mongoose');
// Password hashing
const bcrypt = require('bcrypt');


// Define the schema for a user document
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
  firstname: String,
  lastname: String
});

// Define action to complete before saving a document.
// Here we make sure that every password is hashed before placing it in the database
UserSchema.pre('save', function(callback){
  // Preserve 'this' as user object because it gets overridden in the bcrypt functions
  const user = this;

  // Exit function if the password has not been changed
  if(!user.isModified('password')){
    return callback();
  }

  // Hash password with bcrypt using 10 salt rounds
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      // Propagate error to callback if hashing failed
      callback(err);
    } else {
      // Change password string to hashed password
      user.password = hash;
      callback();
    }
  });
});

/** Instance method to facilitate password verification.
* @param password The password to verify against the user document
* @param callback The function to call on completion of error. The first parameter of this callback is an error object and the second is boolean of whether or not the passwords match
*/
UserSchema.methods.verifyPassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, match){
    if (err){
      callback(err);
    } else {
      callback(null, match);
    }
  })
}

// Create a model as a programming interface with mogodb, specify the collection name 'User' and the schema 'UserSchema'
module.exports = mongoose.model('User', UserSchema);
