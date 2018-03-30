/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A device token uniquely identifies an iOS device that has registered for remote push notifications via APNs.
 */
const mongoose = require('mongoose');

/**
 * Create the schema.
 * Value is the actual iOS device token
 * user is the ID of the user currently logged in on the device
 */
const DeviceTokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('DeviceToken', DeviceTokenSchema);
