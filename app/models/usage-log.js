/**
 * This module is responsible for enforcing a document schema in the nodejs code through mongoose.
 * A usage log is a record of a users use of a certain client application.
 */

const mongoose = require('mongoose');
const Client = require('app/models/client');
const UsageLogSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  log: {
    required: true,
    type: {
      locations: [{
        longitude: String,
        latitude: String
      }],
      startTime: Date,
      endTime: Date
    }
  }
});

UsageLogSchema.virtual('duration').get(function(){
  return Math.round((this.log.endTime - this.log.startTime) / 1000)
});

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

UsageLogSchema.virtual('platform').get(async function(){
  const client = await require('app/models/client').findOne({_id: this.clientId}, 'platform')
  return client.platform
})

UsageLogSchema.virtual('client').get(async function(){
  const client = await require('app/models/client').findOne({_id: this.clientId})
  return client
})

module.exports = mongoose.model('UsageLog', UsageLogSchema);
