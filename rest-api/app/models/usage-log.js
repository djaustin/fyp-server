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
