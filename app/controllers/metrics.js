const UsageLog = require('app/models/usage-log');
const Client = require('app/models/client');
const Application = require('app/models/application');
exports.getAggregatedMetrics = async function(req, res, next){
  try{
    const [overall, applications, platforms] = await Promise.all([getOverallMetrics(req), getApplicationsMetrics(req), getPlatformsMetrics(req)])
    res.jsend.success({overall, applications: applications.applications, platforms: platforms.platforms})
  }catch(err){
    next(err)
  }
}

exports.getApplicationMetricsById = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationMetricsByIdWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationsMetrics = async function(req, res, next){
  try{
    const results = await getApplicationsMetrics(req)
    res.jsend.success(results)
  } catch(err){
    next(err)
  }
}


async function getApplicationsMetrics(req, options){
  const params = generateParamsObject(req)
  // Get the usage logs
  const logs = await UsageLog.find(params)
  const logClientIds = logs.map(log => log.clientId)
  const clients = await Client.find({_id: { $in: logClientIds}})
  const clientApplicationIds = clients.map(client => client.applicationId)
  const applications = await Application.find({_id: { $in: clientApplicationIds}})
  const results = {
    applications: []
  }
  for (client of clients) {
    const applicableLogs = logs.filter(l =>{
      return String(l.clientId) === String(client._id)
    });
    const usageSum = applicableLogs.reduce(((accumulator, current) => accumulator + current.duration), 0)
    const clientApplication = applications.find(application => String(application._id) === String(client.applicationId))
    const resultApplication = results.applications.find(application => String(application.id) === String(clientApplication._id))
    if(resultApplication) {
      resultApplication.duration += usageSum
    } else {
      results.applications.push({
        id: clientApplication._id,
        name: clientApplication.name,
        duration: usageSum
      })
    }
  }
  return results
}

exports.getApplicationsMetricsWithQuery = function(req, res, next){

}

exports.getOverallMetrics = async function(req, res, next){
  try{
    const result = await getOverallMetrics(req)
    res.jsend.success(result)
  } catch(err){
    next(err)
  }
}

async function getOverallMetrics(req){
    const params = generateParamsObject(req)
    const overallDuration = await UsageLog.getOverallSecondsForUser(params);
    return {duration: overallDuration}
}

exports.getOverallMetricsWithQuery = function(req, res, next){

}

exports.getPlatformMetricsByName = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformMetricsByNameWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformsMetrics = async function(req, res, next){
  try{
    const results = await getPlatformsMetrics(req)
    res.jsend.success(results)
  }catch(err){
    next(err)
  }
}

async function getPlatformsMetrics(req){
  const params = generateParamsObject(req)
  const logs = await UsageLog.find(params)
  const results = {
    platforms: []
  }
  for (log of logs){
    const logPlatform = await log.platform
    const resultPlatform = results.platforms.find(platform => {
      return platform.name === logPlatform
    })
    if(!resultPlatform) {
      results.platforms.push({name: logPlatform, duration: log.duration})
    } else {
      resultPlatform.duration += log.duration
    }
  }
  return results
}

exports.getPlatformsMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

function generateParamsObject(req){
  options = req.query || {}
  const params = {}
  params.userId = req.user._id

  if (options.fromTime){
    params['log.startTime'] = {
      "$gte": new Date(Number(options.fromTime))
    }
  }
  if (options.toTime){
    params['log.endTime'] = {
      "$lte": new Date(Number(options.toTime))
    }
  }
  return params
}
