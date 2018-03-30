/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A period is used when specifying a usage goal.
 */
const mongoose = require('mongoose');

/**
 * Create the schema.
 * name is the name of the period eg. 'Weekly'
 * key is the API friendly name of the period
 * duration is the duration of the period in seconds
 */
const PeriodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Period', PeriodSchema);
