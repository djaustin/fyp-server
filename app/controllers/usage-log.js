const logger = require('app/utils/logger');
const UsageLog = require('app/models/usage-log');
const DeviceToken = require('app/models/deviceToken');
const rsmq = require('app/utils/rsmq');

/**
 * Add a new usage log for the user and client authenticated by an access token.
 * @param req {Object} request object containing the userId and client object in req.params.userId and req.client
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.newUsageLog = async function(req, res, next){
  if(!req.body.startTime || !req.body.endTime){
    let error = new Error("Usage logs must contain a start and end time")
    error.status = 400
    return next(error);
  }
  //TODO: Find a way to allow user to report usage without a client application
  const log = new UsageLog({
    userId: req.user._id,
    clientId: req.client._id, // client was added to the req object in the BearerStrategy. It only exists if a client made this requets with an access token
    log: {
      startTime: new Date(Number(req.body.startTime)),
      endTime: new Date(Number(req.body.endTime))
    }
  });

  try{
    await log.save();
    res.status(201);
    addUserIdToNotificationQueue(req.user._id);
    res.jsend.success({
      log: log,
      locations: [`https://digitalmonitor.tk/api/users/${req.params.userId}/usage-logs/${log._id}`]
    });
  } catch(err){
    next(err);
  }
}

/**
 * Get all usage logs for a given authenticated and authorized user by userId
 * @param req {Object} request object containing the userId in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getUserLogs = async function(req, res, next){
  try{
    const logs = await UsageLog.find({userId: req.params.userId});
    res.jsend.success({logs: logs});
  } catch(err){
    next(err);
  }
}

/**
 * Get an individual usage log of a user by usageLogId
 * @param req {Object} request object containing the usageLogId in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getUserLog = async function(req, res, next){
  try{
    const log = await UsageLog.findOne({_id: req.params.usageLogId});
    res.jsend.success(log);
  } catch(err){
    next(err);
  }
}

/**
 * Add a new collection of usage logs for the user and client authenticated by an access token.
 * This allows for bulk sending of usage logs from the client which reduces load on the server
 * as well as decreasing the number of requests the client must make.
 * @param req {Object} request object containing the userId and client object in req.params.userId and req.client
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.newUsageLogCollection = async function(req, res, next){
  //TODO: Find a way to allow user to report usage without a client application
  if (!(req.body instanceof Array)){
    let error = new Error("Request body must be an array of usage log objects")
    error.status = 400
    return next(error);
  }
  let usageLogs = []
  for (log of req.body) {
    let error;
    if(!log.startTime || !log.endTime){
      error = new Error("Usage logs must contain a start and end time")
    }
    let usageLog = new UsageLog({
      userId: req.user._id,
      clientId: req.client._id, // client was added to the req object in the BearerStrategy. It only exists if a client made this requets with an access token
      log: {
        startTime: new Date(Number(log.startTime)),
        endTime: new Date(Number(log.endTime))
      }
    });
    error = usageLog.validateSync()
    if(error){
      error.status = 400
      return next(error);
    } else {
      usageLogs.push(usageLog)
    }
  }
  try{
    await Promise.all(usageLogs.map(e => e.save()));
    res.status(201);
    addUserIdToNotificationQueue(req.user._id);
    res.jsend.success({
      logs: usageLogs,
      locations: usageLogs.map(e => `https://digitalmonitor.tk/api/users/${req.user._id}/usage-logs/${e._id}`)
    });
  } catch(err){
    next(err);
  }
}


function addUserIdToNotificationQueue(id){
  logger.debug("Adding userId " + id + " to message queue");
  rsmq.sendMessage({qname: "userIds", message: String(id)}, function (err, resp) {
    if (resp) {
        logger.debug(resp)
    } else {
      if(err){
        logger.debug(err)
      }
    }
});
}
