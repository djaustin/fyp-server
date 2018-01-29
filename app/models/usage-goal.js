const mongoose = require('mongoose');
const UsageLog = require('app/models/usage-log');
const logger = require('app/utils/logger');
const UsageGoalSchema = new mongoose.Schema({
  applicationId: mongoose.Schema.ObjectId,
  platform: String,
  period: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'yearly']
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
  // Convert period into date range
  const dateRange = periodToRollingDateRange(this.period)
  // Find all usage logs in that date range for the platform and applicationId specified
  var logs = await UsageLog.find({
    userId: userId,
    'log.startTime': { $gte : dateRange.startTime},
    'log.endTime': { $lte: dateRange.endTime},
  })
  
  let logsWithClients = []

  for (log of logs) {
    let client =  await log.client
    logsWithClients.push({log: log, client: client})
  }


  if(this.applicationId){
    logsWithClients = logsWithClients.filter(e => String(e.client.applicationId) === String(this.applicationId))
  }
  if(this.platform){
    logsWithClients = logsWithClients.filter(e => String(e.client.platform) === String(this.platform))
  }

  // Sum the durations of the usage logs
  const totalDuration = logsWithClients.reduce((acc, e) => e.log.duration + acc, 0)
  // Calculate percentage progress
  return (totalDuration/this.duration);
}

function periodToRollingDateRange(period){
  var result = {
    endTime: new Date()
  }
  let startTime = new Date()
  switch (period) {
    case 'daily':
      startTime.setDate(startTime.getDate()-1)
      break;
    case 'weekly':
      startTime.setDate(startTime.getDate()-7)
      break;
    case 'monthly':
      startTime.setMonth(startTime.getMonth()-1)
      break;
    case 'yearly':
      startTime.setFullYear(startTime.getFullYear()-1)
      break;
    default:
  }
  result.startTime = startTime
  return result
}

exports.model = mongoose.model('UsageGoal', UsageGoalSchema);
exports.schema = UsageGoalSchema
