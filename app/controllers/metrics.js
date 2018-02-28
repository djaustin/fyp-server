const UsageLog = require('app/models/usage-log');
const Client = require('app/models/client');
const Platform = require('app/models/platform');
const Application = require('app/models/application');
exports.getAggregatedMetrics = async function(req, res, next){
  try{
    const [overall, applications, platforms] = await Promise.all([getOverallMetrics(req), getApplicationsMetrics(req), getPlatformsMetrics(req)])
    res.jsend.success({overall, applications, platforms: platforms.platforms})
  }catch(err){
    next(err)
  }
}

exports.getApplicationMetricsById = async function(req, res, next){
  try{
    const results = await getApplicationMetricsById(req)
    res.jsend.success(results)
  } catch(err){
    next(err)
  }
}

async function getApplicationMetricsById(req){
  const applicationId = req.params.applicationId
  const params = generateParamsObject(req)
  const logs = await UsageLog.find(params)
  const results = {
    platforms: []
  }
  for (log of logs){
    const client = await log.client
    if(String(client.applicationId) !== applicationId){
      continue;
    }
    const logPlatformId = await log.platform
    const logPlatform = await Platform.findOne({_id: logPlatformId})
    const resultPlatform = results.platforms.find(platform => {
      return platform.platform.name === logPlatform.name
    })
    if(!resultPlatform) {
      results.platforms.push({platform: logPlatform, duration: log.duration})
    } else {
      resultPlatform.duration += log.duration
    }
  }
  return results
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
  const results = []
  for (client of clients) {
    const applicableLogs = logs.filter(l =>{
      return String(l.clientId) === String(client._id)
    });
    const usageSum = applicableLogs.reduce(((accumulator, current) => accumulator + current.duration), 0)
    const clientApplication = applications.find(application => String(application._id) === String(client.applicationId))
    const resultApplication = results.find(e => String(e.application._id) === String(clientApplication._id))
    if(resultApplication) {
      resultApplication.duration += usageSum
    } else {
      results.push({
        application: clientApplication,
        duration: usageSum
      })
    }
  }
  return results
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

exports.getPlatformMetricsById = async function(req, res, next){
  try{
    const result = await getPlatformMetricsById(req);
    res.jsend.success(result)
  }catch(err){
    next(err)
  }
}


async function getPlatformMetricsById(req){
  const params = generateParamsObject(req)
  const logs = await UsageLog.find(params)
  const results = []
  for (log of logs){
    const logClient = await log.client
    console.log(logClient.platform, req.params.platformId);
    if (String(logClient.platform) !== req.params.platformId){
      continue;
    }
    const applicationId = logClient.applicationId;

    console.log("Application Id:", applicationId);
    const logApplication = (await Application.findOne({_id: applicationId}));
    console.log("logApplication", logApplication);
    const resultApplication = results.find(e => {
      return String(e.application._id) === String(logApplication._id)
    })
    console.log("resultApplication", resultApplication);
    if(!resultApplication) {
      results.push({
        application: logApplication,
        duration: log.duration
      })
      console.log("results", results);
    } else {
      resultApplication.duration += log.duration
    }
  }
  return results
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
    const logPlatformId = await log.platform
    const logPlatform = await Platform.findOne({_id: logPlatformId});
    const resultPlatform = results.platforms.find(platform => {
      return platform.platform.name === logPlatform.name
    })
    if(!resultPlatform) {
      results.platforms.push({platform: logPlatform, duration: log.duration})
    } else {
      resultPlatform.duration += log.duration
    }
  }
  return results
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
