const logger = require('app/utils/logger');
const UsageLog = require('app/models/usage-log');
const DeviceToken = require('app/models/deviceToken');
const apnProvider = require('app/utils/apns');
const apn = require('apn');
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
    const tokens = await DeviceToken.find({user: req.user._id});
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.sound = "ping.aiff";
    note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
    note.payload = {'messageFrom': 'John Appleseed'};
    note.topic = "com.djaustin.Digital-Monitor";
    const destinations = tokens.map(e => e.value)
    logger.debug("Destinations:", destinations);
    await apnProvider.send(note, destinations);
    res.status(201);
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
