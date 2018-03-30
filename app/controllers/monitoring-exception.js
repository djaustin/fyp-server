/**
 * Controller to manage the handling of requests to the endpoints for the monitoring exceptions resource
 */

const MonitoringException = require('app/models/monitoring-exception');
const Application = require('app/models/application');
const Platform = require('app/models/platform');
const logger = require('app/utils/logger');

/**
 * Get a collection of all monitoring exceptions for a user.
 * @param req {Object} Request object containing the authenticated user in req.user
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getUserMonitoringExceptions = async function(req, res, next){
  try {
    // Get all monitoring exceptions matching the user ID of the authenticated user along with linked applications and platforms
    const exceptions = await MonitoringException.find({user: req.user._id}).populate('application').populate('platform');
    res.jsend.success({monitoringExceptions: exceptions});
  } catch(err) {
    next(err);
  }
}

/**
 * Add a new monitoring exception for the authenticated user
 * @param req {Object} Request object containing the authenticated user in req.user and the monitoring exception details in req.body
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.postUserMonitoringException = async function(req, res, next){
  try {
    let platform, application;
    // Validate the provided details and return an error if invalid
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
    // Create a new monitoring exception document
    const exception = new MonitoringException({
      platform: req.body.platformId,
      application: req.body.applicationId,
      startTime: new Date(Number(req.body.startTime)),
      endTime: new Date(Number(req.body.endTime)),
      user: user._id
    })
    // Add the platform and application documents as subdocuments so that they can be included in the response instead of just their IDs
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

/**
 * Edit the details of an existing monitoring exception for the authenticated user by monitoring exception ID
 * @param req {Object} Request object containing the authenticated user in req.user, the monitoring exception details in req.body, and the exception ID in req.params.exceptionId
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.putUserMonitoringException = async function(req, res, next){
  try{
    // Validate the provided details and return an error if invalid
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
    await exception.save()
    res.jsend.success(null)
  } catch(err){
    next(err)
  }
}

/**
 * Get the detail of a monitoring exception by ID
 * @param req {Object} Request object containing the authenticated user in req.user and the ID in req.params.exceptionId
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
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

/**
 * Delete a monitoring exception by ID
 * @param req {Object} Request object containing the authenticated user in req.user and the ID in req.params.exceptionId
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.deleteUserMonitoringException = async function(req, res, next){
  try{
    await MonitoringException.remove({_id: req.params.exceptionId, user: req.user._id})
    res.jsend.success(null);
  }catch(err){
    next(err);
  }
}
