const UsageLog = require('app/models/usage-log');
const Client = require('app/models/client');
const Application = require('app/models/application');
exports.getAggregatedMetrics = function(req, res, next){
  // TODO: Implement this
}

exports.getAggregatedMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getAggregatedMetrics = function(req, res, next){
  // TODO: Implement this
}

exports.getAggregatedMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationMetricsById = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationMetricsByIdWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationsMetrics = async function(req, res, next){
  // Get the usage logs
  try{
    const logs = await UsageLog.find({userId: req.user._id})
    console.log(logs);
    const logClientIds = logs.map(log => log.clientId)
    console.log("logClientIds", logClientIds);
    const clients = await Client.find({_id: { $in: logClientIds}})
    console.log("clients", clients);
    const clientApplicationIds = clients.map(client => client.applicationId)
    console.log("clientApplicationIds", clientApplicationIds);
    const applications = await Application.find({_id: { $in: clientApplicationIds}})
    console.log("applications", applications);
    const results = {
      applications: []
    }
    for (client of clients) {
      const applicableLogs = logs.filter(l =>{
        console.log(l.clientId, client._id);
        console.log(typeof(l.clientId), typeof(client._id));
        return String(l.clientId) === String(client._id)
      });
      console.log("applicableLogs", applicableLogs);
      const usageSum = applicableLogs.reduce(((accumulator, current) => accumulator + current.duration), 0)
      console.log("usageSum", usageSum);
      const clientApplication = applications.find(application => String(application._id) === String(client.applicationId))
      console.log("clientApplication", clientApplication);
      const resultApplication = results.applications.find(application => String(application.id) === String(clientApplication._id))
      console.log("resultApplication", resultApplication);
      if(resultApplication) {
        resultApplication.usage += usageSum
      } else {
        results.applications.push({
          id: clientApplication._id,
          name: clientApplication.name,
          usage: usageSum
        })
      }
    }
    res.jsend.success(results)
  } catch(err){
    next(err)
  }
  // Organise into applications (log.clientId -> client.applicationId -> application)
  // Sum usage for each application and return as json object
}

exports.getApplicationsMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getOverallMetrics = async function(req, res, next){
  try{
    console.log("in getOverallMetrics");
    console.log("About to try to get duration");
    const overallDuration = await UsageLog.getOverallSecondsForUser(req.user._id);
    res.jsend.success({duration: overallDuration})
  } catch(err){
    next(err)
  }
}

exports.getOverallMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformMetricsByName = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformMetricsByNameWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformsMetrics = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformsMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}
