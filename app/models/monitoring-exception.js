const mongoose = require('mongoose');


const MonitoringExceptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  application: {
    type: mongoose.Schema.ObjectId,
    ref: 'Application'
  },
  platform: {
    type: mongoose.Schema.ObjectId,
    ref: 'Platform'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('MonitoringException', MonitoringExceptionSchema);
