/*
 *  This module contains the data model for organisations in the application.
 *  It provides a representation of the schema of the mongodb documents.
 *  An organisation (eg. Facebook Inc.) can log in to administer their applications and clients for OAuth2
 */

const mongoose = require('mongoose');
// Import module containing password utilities such as hashing and verification
const crypto = require('app/utils/crypto');

const OrganisationSchema = new mongoose.Schema({
  // Organisation name eg. Facebook Inc.
  name: {
    type: String,
    required: true
  },
  // Email to login for admin
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  // Registered applications eg. Facebook, Messenger, Instagram
  applications: {
    type: [mongoose.Schema.ObjectId]
  }
}, {usePushEach: true}); // required due to deprecated mongo feature being used by mongoose

// Ensure all passwords are hashed before saving to the database
OrganisationSchema.pre('save', crypto.hashSecret('password'));

// Helper function fo verifying document instance passwords
OrganisationSchema.methods.verifyPassword = crypto.verifySecret('password');

// Create a model as a programming interface with mogodb, specify the collection name 'User' and the schema 'UserSchema'
module.exports = mongoose.model('Organisation', OrganisationSchema);
