const mongoose = require('mongoose');
const UsageLog = require('app/models/usage-log');
const Client = require('app/models/client');
const Period = require('app/models/period');
const logger = require('app/utils/logger');
const moment = require('moment');
const UsageGoalSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.ObjectId,
    ref: 'Application'
  },
  platform: {
    type: mongoose.Schema.ObjectId,
    ref: 'Platform'
  },
  period: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Period'
  },
  duration: {
    type: Number,
    required: true
  }
})

UsageGoalSchema.methods.getProgress = async function(userId){
  if(!userId){
    throw new Error("Cannot get progress without userId")
  }
  // Get duration
  const duration = this.duration;
  // Get the period information for this goal
  const period = await Period.findOne({_id: this.period})
  // Convert period into date range
  const endTime = moment().endOf(period.key).toDate()
  const startTime = moment().startOf(period.key).toDate();
  const params = {
    userId: userId,
    'log.startTime': { $gte : startTime},
    'log.endTime': { $lte: endTime},
  }
  if(this.application && this.platform){
    const clientIds = await Client.find({applicationId: this.application._id, platform: this.platform._id}).lean().distinct('_id')
    params.clientId = {$in: clientIds}
  } else if(this.application){
    const applicationClientIds = await Client.find({applicationId: this.application._id}).lean().distinct('_id')
    params.clientId = {$in: applicationClientIds}
  } else if(this.platform){
    const platformClientIds = await Client.find({platform: this.platform._id}).lean().distinct('_id')
    params.clientId = {$in: applicationClientIds}
  }
  // Find all usage logs in that date range for the platform and applicationId specified
  var logs = await UsageLog.find(params)
  // Sum the durations of the usage logs
  const totalDuration = logs.reduce((acc, e) => e.duration + acc, 0)
  // Calculate percentage progress
  return (totalDuration/this.duration);
}

exports.model = mongoose.model('UsageGoal', UsageGoalSchema);
exports.schema = UsageGoalSchema
