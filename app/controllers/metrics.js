/**
 * Controller to manage the handling of requests to the endpoints for the metrics resource
 */

const UsageLog = require('app/models/usage-log');
const Client = require('app/models/client');
const Platform = require('app/models/platform');
const Application = require('app/models/application');

/**
 * Get all metrics formats in one request
 * @param req {Object} request object containing the authenticated user as well as from and to dates if provided
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getAggregatedMetrics = async function(req, res, next){
  try{
    const [overall, applications, platforms] = await Promise.all([getOverallMetrics(req), getApplicationsMetrics(req), getPlatformsMetrics(req)])
    res.jsend.success({overall, applications, platforms: platforms.platforms})
  }catch(err){
    next(err)
  }
}

/**
 * Get application metrics with an application ID. This shows how long has been spent on each platform when using the application.
 * @param req {Object} Request object containing the authenticated user, application ID, and from and to dates if provided
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getApplicationMetricsById = async function(req, res, next){
  try{
    const results = await getApplicationMetricsById(req)
    res.jsend.success(results)
  } catch(err){
    next(err)
  }
}

/**
 * Get application metrics with an application ID. This shows how long has been spent on each platform when using the application.
 * @param req {Object} Request object containing the authenticated user, application ID, and from and to dates if provided
 */
async function getApplicationMetricsById(req){
  const applicationId = req.params.applicationId
  // Retrieve clients owned by the application matching the provided ID
  const applicationClients = await Client.find({applicationId: applicationId})
  // Get the query used to search for usage logs
  const params = generateParamsObject(req)
  // Only get logs from clients owned by the application provided
  params.clientId = { $in: applicationClients.map(e => e._id) }
  // Retrieve matching usage logs along with the client and platform documents linked to them
  const logs = await UsageLog.find(params)
    .populate({
      path: 'clientId',
      select: {platform: 1},
      populate: {path: 'platform'}
    })
  // Retrieve all platform documents from the database
  const platforms = await Platform.find()
  const results = {
    platforms: []
  }
  for (platform of platforms) {
    // Find the usage logs that belong to the current platform of the iteration
    const applicableLogs = logs.filter(e => String(platform._id) === String(e.clientId.platform._id))
    if(applicableLogs.length < 1) continue;
    // Sum the duration of the logs
    const usageSum = applicableLogs.reduce(((accumulator, current) => accumulator + current.duration), 0);
    // Add the platform and duration to the results set
    results.platforms.push({platform: platform, duration: usageSum})
  }
  return results
}

/**
 * Get application metrics. This shows how long the user has spent across all platforms on each application.
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getApplicationsMetrics = async function(req, res, next){
  try{
    const results = await getApplicationsMetrics(req)
    res.jsend.success(results)
  } catch(err){
    next(err)
  }
}

/**
 * Get application metrics. This shows how long the user has spent across all platforms on each application.
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 */
async function getApplicationsMetrics(req, options){
  // Get the query used to search for usage logs
  const params = generateParamsObject(req)
  // Get the matching usage logs from the database
  const logs = await UsageLog.find(params)
  // Get all client IDs from the matching logs
  const logClientIds = logs.map(log => log.clientId)
  // Get the client documents matching the usage log client IDs
  const clients = await Client.find({_id: { $in: logClientIds}})
  // Get application IDs from all the clients
  const clientApplicationIds = clients.map(client => client.applicationId)
  // Get all applications matching the application IDs from the clients
  const applications = await Application.find({_id: { $in: clientApplicationIds}})
  const results = []
  for (client of clients) {
    // Filter out usage logs that were not created by the current client of the iteration
    const applicableLogs = logs.filter(l =>{
      return String(l.clientId) === String(client._id)
    });
    // Sum the duration for the client
    const usageSum = applicableLogs.reduce(((accumulator, current) => accumulator + current.duration), 0)
    // Get the application document that owns the current client of the iteration
    const clientApplication = applications.find(application => String(application._id) === String(client.applicationId))
    // If the application is already in the results set, add the duration total of this client to the application total. Otherwise add the application and duration to the result set
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

/**
 * Get overall metrics. This shows how long the user has spent across all platforms and all applications as a single value in seconds
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getOverallMetrics = async function(req, res, next){
  try{
    const result = await getOverallMetrics(req)
    res.jsend.success(result)
  } catch(err){
    next(err)
  }
}

/**
 * Get overall metrics. This shows how long the user has spent across all platforms and all applications as a single value in seconds
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 */
async function getOverallMetrics(req){
    const params = generateParamsObject(req)
    // Get the sum of usage logs matching the query for this user
    const overallDuration = await UsageLog.getOverallSecondsForUser(params);
    return {duration: overallDuration}
}

/**
 * Get overall metrics. This shows how long the user has spent across all platforms and all applications as a single value in seconds
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getPlatformMetricsById = async function(req, res, next){
  try{
    const result = await getPlatformMetricsById(req);
    res.jsend.success(result)
  }catch(err){
    next(err)
  }
}

/**
 * Get platform metrics. This shows how long the user has spent across all applications on a specific platform
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
async function getPlatformMetricsById(req){
  const params = generateParamsObject(req)
  // Get all usage logs matching the query along with the clients, applications, and platforms linked to the logs.
  let logs = await UsageLog.find(params)
    .populate({
      path: 'clientId',
      select: {platform: 1},
      populate: [{path: 'platform'}, {path: 'applicationId'}]
    })
  // Filter out logs that do not belong to the platform being queried
  logs = logs.filter(e => String(e.clientId.platform._id) === String(req.params.platformId))
  const results = []
  for (log of logs){
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

/**
 * Get platform metrics. This shows how long the user has spent across all applications on each platform
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getPlatformsMetrics = async function(req, res, next){
  try{
    const results = await getPlatformsMetrics(req)
    res.jsend.success(results)
  }catch(err){
    next(err)
  }
}

/**
 * Get platform metrics. This shows how long the user has spent across all applications on each platform
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 */
async function getPlatformsMetrics(req){
  const params = generateParamsObject(req)
  // Get all usage logs matching the query along with the clients, applications, and platforms linked to the logs.
  const logs = await UsageLog.find(params)
    .populate({
      path: 'clientId',
      select: {platform: 1},
      populate: {path: 'platform'}
    })
  // Get all platforms from the database
  const platforms = await Platform.find()
  const results = {
    platforms: []
  }
  // Sum the usage logs for each platform and add them to the results set
  for (platform of platforms) {
    const applicableLogs = logs.filter(e => String(platform._id) === String(e.clientId.platform._id))
    if(applicableLogs.length < 1) continue;
    const usageSum = applicableLogs.reduce(((accumulator, current) => accumulator + current.duration), 0);
    results.platforms.push({platform: platform, duration: usageSum})
  }
  return results
}

/**
 * Generate a parameters object to be used for queries by extracting the user Id and time query from the request object if they exist
 * @param req {Object} Request object containing the authenticated user as well as from and to dates if provided
 */
function generateParamsObject(req){
  options = req.query || {}
  const params = {}
  params.userId = req.user._id
  // Parse the fromTime and toTime values to a date for searching
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
