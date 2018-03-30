/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * Platforms are the platforms on which applications are installed eg. iOS, browser.
 */
const mongoose = require('mongoose');
/**
 * Create the schema.
 * name is the name of the platforom eg. iOS
 */
const PlatformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Platform', PlatformSchema);
