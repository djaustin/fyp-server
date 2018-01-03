const logger = require('app/utils/logger');
const UsageLog = require('app/models/usage-log');

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
