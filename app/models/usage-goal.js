const mongoose = require('mongoose');
const UsageLog = require('app/models/usage-log');
const Period = require('app/models/period');
const logger = require('app/utils/logger');
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
  const endTime = new Date();
  const startTime = new Date(Date.now() - period.duration*1000);
  // Find all usage logs in that date range for the platform and applicationId specified
  var logs = await UsageLog.find({
    userId: userId,
    'log.startTime': { $gte : startTime},
    'log.endTime': { $lte: endTime},
  })


  let logsWithClients = []

  for (log of logs) {
    let client =  await log.client
    logsWithClients.push({log: log, client: client})
  }

  if(this.application){
    logsWithClients = logsWithClients.filter(e => String(e.client.applicationId) === String(this.application._id))
  }
  if(this.platform){
    logsWithClients = logsWithClients.filter(e => String(e.client.platform) === String(this.platform._id))
  }


  // Sum the durations of the usage logs
  const totalDuration = logsWithClients.reduce((acc, e) => e.log.duration + acc, 0)
  // Calculate percentage progress
  return (totalDuration/this.duration);
}

exports.model = mongoose.model('UsageGoal', UsageGoalSchema);
exports.schema = UsageGoalSchema
