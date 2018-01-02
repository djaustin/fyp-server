/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A usage log is a record of a users use of a certain client application.
 */

const mongoose = require('mongoose');

const UsageLogSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  log: {
    required: true,
    type: {
      locations: [{
        longitude: String,
        latitude: String
      }],
      startTime: Date,
      endTime: Date
    }
  }
});

module.exports = mongoose.model('UsageLog', UsageLogSchema);
