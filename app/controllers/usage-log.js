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
