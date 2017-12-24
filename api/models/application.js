/*
  This module contains the data model for applications in the application.
  It provides a representation of the schema of the mongodb documents.
  An application represents a software product like Facebook.
  An application may be available on multiple platforms so each requires its own 'client' for OAuth2.
  This application document allows for multiple OAuth clients to share a common parent.
*/

const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  clients: {
    type: [mongoose.Schema.ObjectId]
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);
