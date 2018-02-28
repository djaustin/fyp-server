/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * Platforms are the platforms on which applications are installed eg. iOS, browser.
 */
const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Platform', PlatformSchema);
