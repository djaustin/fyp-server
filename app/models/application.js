/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * An application is something like Facebook that is owned by an organisation but may have many different clients like web, android, ios
 */

// mongodb interface
const mongoose = require('mongoose');

/**
 * Create the schema.
 * Name is the name of the application eg. Facebook
 * Clients is the collection of all OAuth2 clients that are part of this application
 * usePushEach is required due to deprecated feature in mongodb being used by mongoose
 */
const ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  clientIds: {
    type: [mongoose.Schema.ObjectId]
  }
}, {usePushEach: true});

ApplicationSchema.pre('remove', async function(next){
    try{
      // Remove all clients
      const clients = await mongoose.model('Client').find({_id: {$in: this.clientIds }})
      await Promise.all(clients.map(e => e.remove()))
      next()
    } catch(err){
      next(err)
    }
  })

// Export the model created by this schema for use in other files
module.exports = mongoose.model('Application', ApplicationSchema);
