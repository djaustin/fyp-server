const mongoose = require('mongoose');

//TODO: Consider checking the format of these fields before allowing saves
const ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  clients: {
    type: [mongoose.Schema.ObjectId]
  }
}, {usePushEach: true});

module.exports = mongoose.model('Application', ApplicationSchema);
