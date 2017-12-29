const UsageLog = require('app/models/usage-log');

exports.newUsageLog = async function(req, res){
  //TODO: Client must be authenticated
  //TODO: Check that client is authorized by the user
  //TODO: Find a way to allow user to report usage without a client application
  console.log('newUsageLog body:', req.body);
  const log = new UsageLog({
    userId: req.params.userId,
    clientId: req.body.clientId,
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
    console.log(err);
    res.send(err);
  }
}

exports.getUserLogs = async function(req, res){
  try{
    const logs = await UsageLog.find({userId: req.params.userId});
    res.json(logs);
  } catch(err){
    console.log(err);
    res.send(err);
  }
}

exports.getUserLog = async function(req, res){
  try{
    const log = await UsageLog.findOne({_id: req.params.usageLogId});
    res.json(log);
  } catch(err){
    console.log(err);
    res.send(err);
  }
}
