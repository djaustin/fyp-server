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
  const applicationClients = await Client.find({applicationId: applicationId})
  const params = generateParamsObject(req)
  params.clientId = { $in: applicationClients.map(e => e._id) }
  const logs = await UsageLog.find(params)
    .populate({
      path: 'clientId',
      select: {platform: 1},
      populate: {path: 'platform'}
    })
  const platforms = await Platform.find()
  const results = {
    platforms: []
  }
  for (platform of platforms) {
    const applicableLogs = logs.filter(e => String(platform._id) === String(e.clientId.platform._id))
    if(applicableLogs.length < 1) continue;
    const usageSum = applicableLogs.reduce(((accumulator, current) => accumulator + current.duration), 0);
    results.platforms.push({platform: platform, duration: usageSum})
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
  let logs = await UsageLog.find(params)
    .populate({
      path: 'clientId',
      select: {platform: 1},
      populate: [{path: 'platform'}, {path: 'applicationId'}]
    })
  logs = logs.filter(e => String(e.clientId.platform._id) === String(req.params.platformId))
  const results = []
  for (log of logs){
    // const logClient = await log.client
    // if (String(logClient.platform) !== req.params.platformId){
    //   continue;
    // }
    console.log(log);
    console.log("APPLCIAITON", log.clientId.applicationId);
    const resultApplication = results.find(e => {
      return String(e.application._id) === String(log.clientId.applicationId._id)
    })
    if(!resultApplication) {
      results.push({
        application: log.clientId.applicationId,
        duration: log.duration
      })
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
    .populate({
      path: 'clientId',
      select: {platform: 1},
      populate: {path: 'platform'}
    })
  const platforms = await Platform.find()
  const results = {
    platforms: []
  }
  for (platform of platforms) {
    const applicableLogs = logs.filter(e => String(platform._id) === String(e.clientId.platform._id))
    if(applicableLogs.length < 1) continue;
    const usageSum = applicableLogs.reduce(((accumulator, current) => accumulator + current.duration), 0);
    results.platforms.push({platform: platform, duration: usageSum})
  }
  return results
  // const logs = await UsageLog.find(params)
  // const results = {
  //   platforms: []
  // }
  // for (log of logs){
  //   const logPlatformId = await log.platform
  //   const logPlatform = await Platform.findOne({_id: logPlatformId});
  //   const resultPlatform = results.platforms.find(platform => {
  //     return platform.platform.name === logPlatform.name
  //   })
  //   if(!resultPlatform) {
  //     results.platforms.push({platform: logPlatform, duration: log.duration})
  //   } else {
  //     resultPlatform.duration += log.duration
  //   }
  // }
  // return results
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
