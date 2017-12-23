/*
  This module contains the data model for users in the application.
  It provides a representation of the schema of the mongodb documents.
*/

// Mongodb interface
const mongoose = require('mongoose');
// Password hashing
const password = require('./common/password');


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
  firstName: String,
  lastName: String
});

// Define action to complete before saving a document.
// Here we make sure that every password is hashed before placing it in the database
UserSchema.pre('save', password.hashPassword);

// Instance method to facilitate password verification.
UserSchema.methods.verifyPassword = password.verifyPassword;

// Create a model as a programming interface with mogodb, specify the collection name 'User' and the schema 'UserSchema'
module.exports = mongoose.model('User', UserSchema);
