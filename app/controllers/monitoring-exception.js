const MonitoringException = require('app/models/monitoring-exception');
const Application = require('app/models/application');
const Platform = require('app/models/platform');
const logger = require('app/utils/logger');

exports.getUserMonitoringExceptions = async function(req, res, next){
  try {
    const exceptions = await MonitoringException.find({user: req.user._id}).populate('application').populate('platform');
    res.jsend.success({monitoringExceptions: exceptions});
  } catch(err) {
    next(err);
  }
}

exports.postUserMonitoringException = async function(req, res, next){
  try {
    let platform, application;
    if(req.body.platformId){
      platform = await Platform.findOne({_id: req.body.platformId});
      if(!platform){
        let error = new Error('Unable to find platform with ID ' + req.body.platformId)
        error.status = 422;
        return next(error);
      }
    }
    if(req.body.applicationId){
      application = await Application.findOne({_id: req.body.applicationId});
      if(!application){
        let error = new Error('Unable to find application with ID ' + req.body.applicationId)
        error.status = 422;
        return next(error);
      }
    }
    if(!req.body.startTime || !req.body.endTime){
      let error = new Error("Monitoring exceptions must contain a start and end time")
      error.status = 400
      return next(error);
    }
    const user = req.user
    const exception = new MonitoringException({
      platform: req.body.platformId,
      application: req.body.applicationId,
      startTime: new Date(Number(req.body.startTime)),
      endTime: new Date(Number(req.body.endTime)),
      user: user._id
    })
    const exceptionObj = exception.toObject();
    exceptionObj.platform = platform;
    exceptionObj.application = application;
    await exception.save()
    res.status(201)
    res.jsend.success({
      monitoringException: exceptionObj,
      locations: ["https://digitalmonitor.tk/api/users/" + user._id + "/monitoring-exception/" + exception._id + "/"]
    });
  } catch(err){
    next(err)
  }
}

exports.putUserMonitoringException = async function(req, res, next){
  try{
    if(req.body.platformId){
      platform = await Platform.findOne({_id: req.body.platformId});
      if(!platform){
        let error = new Error('Unable to find platform with ID ' + req.body.platformId)
        error.status = 422;
        return next(error);
      }
    }
    if(req.body.applicationId){
      application = await Application.findOne({_id: req.body.applicationId});
      if(!application){
        let error = new Error('Unable to find application with ID ' + req.body.applicationId)
        error.status = 422;
        return next(error);
      }
    }
    if(!req.body.startTime || !req.body.endTime){
      let error = new Error("Monitoring exceptions must contain a start and end time")
      error.status = 400
      return next(error);
    }
    const user = req.user
    const exception = await MonitoringException.findOne({_id: req.params.exceptionId, user: req.user._id})
    if(!exception){
      let err = new Error("Monitoring exception not found")
      err.status = 404
      throw err
    }
    exception.platform = req.body.platformId
    exception.application = req.body.applicationId
    exception.startTime = new Date(Number(req.body.startTime));
    exception.endTime = new Date(Number(req.body.endTime)),
    console.log("EXCEPTION", exception);
    await exception.save()
    res.jsend.success(null)
  } catch(err){
    next(err)
  }
}

exports.getUserMonitoringExceptionById = async function(req, res, next){
  const exception = await MonitoringException.findOne({_id: req.params.exceptionId, user: req.user._id}).populate('application').populate('platform');
  if(!exception){
    const error = new Error('Monitoring exception not found');
    error.status = 404;
    next(error);
  } else {
    res.jsend.success({monitoringException: exception});
  }
}

exports.deleteUserMonitoringException = async function(req, res, next){
  try{
    await MonitoringException.remove({_id: req.params.exceptionId, user: req.user._id})
    res.jsend.success(null);
  }catch(err){
    next(err);
  }
}
