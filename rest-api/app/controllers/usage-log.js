const logger = require('app/utils/logger');
const UsageLog = require('app/models/usage-log');

/**
 * Add a new usage log for the user and client authenticated by an access token.
 * @param req {Object} request object containing the userId and client object in req.params.userId and req.client
 * @param res {Object} response object with which to send client feedback
 */
exports.newUsageLog = async function(req, res){
  //TODO: Find a way to allow user to report usage without a client application
  const log = new UsageLog({
    userId: req.params.userId,
    clientId: req.client._id, // client was added to the req object in the BearerStrategy. It only exists if a client made this requets with an access token
    log: {
      startTime: new Date(Number(req.body.startTime)),
      endTime: new Date(Number(req.body.endTime))
    }
  });
  try{
    await log.save();
    res.status(201);
    res.jsend.success({
      log: log,
      locations: [`https://digitalmonitor.tk/api/users/${req.params.userId}/logs/${log._id}`]
    });
  } catch(err){
    logger.error(err);
    res.jsend.error(err);
  }
}

/**
 * Get all usage logs for a given authenticated and authorized user by userId
 * @param req {Object} request object containing the userId in req.params
 * @param res {Object} response object with which to send result
 */
exports.getUserLogs = async function(req, res){
  try{
    const logs = await UsageLog.find({userId: req.params.userId});
    res.jsend.success({logs: logs});
  } catch(err){
    logger.error(err);
    res.jsend.error(err);
  }
}

/**
 * Get an individual usage log of a user by usageLogId
 * @param req {Object} request object containing the usageLogId in req.params
 * @param res {Object} response object with which to send result
 */
exports.getUserLog = async function(req, res){
  try{
    const log = await UsageLog.findOne({_id: req.params.usageLogId});
    res.jsend.success(log);
  } catch(err){
    logger.error(err);
    res.jsend.error(err);
  }
}
