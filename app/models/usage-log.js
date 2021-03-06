/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A usage log is a record of a users use of a certain client application.
 */

const mongoose = require('mongoose');
const Client = require('app/models/client');

/**
 * Create the schema.
 * clientId is the client that created the usage log
 * userId is the user that owns the usage log
 * log contains the details of the usage log with a start and end time and optional location data
 */
const UsageLogSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  log: {
    required: true,
    type: {
      locations: [{
        timestamp: {
          type: Date,
          required: true
        },
        longitude: {
          type: Number,
          required: true
        },
        latitude: {
          type: Number,
          required: true
        }
      }],
      startTime: {
        type: Date,
        required: true
      },
      endTime: {
        type: Date,
        required: true
      }
    }
  }
}, {toObject: {virtuals: true}});

/**
 * Convenience virtual property to get the duration of the usage log
 */
UsageLogSchema.virtual('duration').get(function(){
  return Math.round((this.log.endTime - this.log.startTime) / 1000)
});

/**
 * Gets the total duration of all usage logs returned by the parameterised query
 * @param params {Object} Usage log query parameters
 */
UsageLogSchema.statics.getOverallSecondsForUser = function(params){
  const schema = this
  return new Promise(async function(resolve, reject) {
    if(!params.userId){
      const err = new Error("User ID must be provided to query getSecondsByUserId")
      return reject(err)
    }

    try{
      const logs = await schema.find(params, {log: 1});
      const durations = logs.map(e => Number(e.duration))
      const totalDuration = durations.reduce(((acc, current) => acc + current), 0);
      resolve(totalDuration);
    } catch(err){
      return reject(err)
    }
  });
}

// Virtual document property that gets the platform of this usage log
UsageLogSchema.virtual('platform').get(async function(){
  const client = await require('app/models/client').findOne({_id: this.clientId}, 'platform')
  const platform = await require('app/models/platform').findOne({_id: client.platform});
  return client.platform
})

// Virtual document property that gets the client of this usage log 
UsageLogSchema.virtual('client').get(async function(){
  const client = await require('app/models/client').findOne({_id: this.clientId})
  return client
})

module.exports = mongoose.model('UsageLog', UsageLogSchema);
