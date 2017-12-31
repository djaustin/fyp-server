const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  // Stores the code value
  // NOTE: Consider hashing this
  value: {
    type: String,
    required: true
  },
  // Used to add addiitional security when checking that the token exchange is legitimate
  redirectUri: {
    type: String,
    required: true,
  },
  // Which user and client own this code
  userId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Code', CodeSchema);
