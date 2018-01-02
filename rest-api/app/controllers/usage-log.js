const logger = require('app/utils/logger');
const UsageLog = require('app/models/usage-log');

exports.newUsageLog = async function(req, res){
  //TODO: Client must be authenticated
  //TODO: Check that client is authorized by the user
  //TODO: Find a way to allow user to report usage without a client application
  //TODO: Ensure user parameter is the same as the authenticated user
  const log = new UsageLog({
    userId: req.params.userId,
    clientId: req.user.client._id, // bearerClient was added to the user object in the BearerStrategy for password. It only exists if a client made this requets with an access token
    log: {
      startTime: new Date(Number(req.body.startTime)), //TODO: Consider using a different method. This feels messy
      endTime: new Date(Number(req.body.endTime))
    }
  });
  try{
    await log.save();
    res.status(201);
    res.json({
      log: log,
      location: `https://digitalmonitor.tk/api/users/${req.params.userId}/logs/${log._id}`
    });
  } catch(err){
    logger.error(err);
    res.send(err);
  }
}

exports.getUserLogs = async function(req, res){
  try{
    const logs = await UsageLog.find({userId: req.params.userId});
    res.json(logs);
  } catch(err){
    logger.error(err);
    res.send(err);
  }
}

exports.getUserLog = async function(req, res){
  try{
    const log = await UsageLog.findOne({_id: req.params.usageLogId});
    res.json(log);
  } catch(err){
    logger.error(err);
    res.send(err);
  }
}
