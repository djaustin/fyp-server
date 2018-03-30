/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A monitoring exception is used to temporarily prevent authorised clients from saving usage logs to the service.
 */

const mongoose = require('mongoose');

/**
 * Create the schema.
 * user is the ID of the user who owns the monitoring exception
 * application is the ID of the application to be excluded from monitoring. All clients under this application will be excluded. If null, all applications are excluded.
 * platform is the ID of the platform to be excluded from monitoring. All clients on this platform will be excluded. If null, all platforms are excluded.
 * startTime is the beginning of the time period during which the exception is active
 * endTime is the end of the time period during which the exception is active
 */
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
