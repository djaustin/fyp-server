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
