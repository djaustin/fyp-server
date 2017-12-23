const mongoose = require('mongoose');
const password = require('./common/password');

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
});

// Ensure all passwords are hashed before saving to the database
OrganisationSchema.pre('save', password.hashPassword);

// Helper function fo verifying document instance passwords
OrganisationSchema.methods.verifyPassword = password.verifyPassword;

module.exports = mongoose.model('Organisation', OrganisationSchema);
