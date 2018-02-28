/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A period is used when specifying a usage goal.
 */
const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Period', PeriodSchema);
