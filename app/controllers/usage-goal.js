/**
 * Controller to manage the handling of requests to the endpoints for the usage goal resource
 */

const UsageGoal = require('app/models/usage-goal').model;
const Period = require('app/models/period');
const Application = require('app/models/application');
const Platform = require('app/models/platform');
const logger = require('app/utils/logger');

/**
 * Get a collection of all usage goals for a user.
 * @param req {Object} Request object containing the authenticated user in req.user
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getUserUsageGoals = function(req, res, next){
  const goals = req.user.usageGoals;
  res.jsend.success({usageGoals: goals})
}

/**
 * Add a new usage goal for a user
 * @param req {Object} Request object containing the authenticated user in req.user and the usage goal details in req.body
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.postUserUsageGoal = async function(req, res, next){
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
    const period = await Period.findOne({_id: req.body.periodId});
    if(!period){
      let error = new Error('Unable to find period with ID ' + req.body.periodId)
      error.status = 422;
      return next(error);
    }
    const user = req.user
    const goal = new UsageGoal({
      platform: req.body.platformId,
      application: req.body.applicationId,
      period: req.body.periodId,
      duration: req.body.duration
    })
    const goalObj = goal.toObject();
    // Add platform, period, application documents as subdocuments so they can be returned in the response
    goalObj.platform = platform;
    goalObj.application = application;
    goalObj.period = period;
    user.usageGoals.push(goal)
    await user.save()
    res.status(201)
    res.jsend.success({
      usageGoal: goalObj,
      locations: [
        "https://digitalmonitor.tk/api/users/" + user._id + "/usage-goals/" + goal._id + "/"
      ]
      })
  } catch(err){
    next(err)
  }
}

/**
 * Get a the progress of all user usage goals
 * @param req {Object} Request object containing the authenticated user in req.user
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getUserGoalProgress = async function(req, res, next){
  try{
    const user = req.user
    var results = []
    for (goal of user.usageGoals) {
      let goalObj = goal.toObject()
      goalObj.progress = await goal.getProgress(user._id)
      goalObj.platform = await Platform.findOne({_id: goal.platform});
      goalObj.period = await Period.findOne({_id: goal.period})
      results.push(goalObj)
    }
    res.jsend.success({usageGoals: results})
  } catch(err){
    next(err)
  }
}

/**
 * Edit a usage goal for a user
 * @param req {Object} Request object containing the authenticated user in req.user and the usage goal details in req.body
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.putUserUsageGoal = async function(req, res, next){
  try{
    if(req.body.platformId){
      const platform = await Platform.findOne({_id: req.body.platformId});
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
    const period = await Period.findOne({_id: req.body.periodId});
    if(!period){
      let error = new Error('Unable to find period with ID ' + req.body.periodId)
      error.status = 422;
      return next(error);
    }
    const user = req.user
    const goal = req.user.usageGoals.id(req.params.goalId)
    if(!goal){
      let err = new Error("Usage goal not found")
      err.status = 404
      throw err
    }
    goal.platform = req.body.platformId
    goal.application = req.body.applicationId
    goal.period = req.body.periodId
    goal.duration = req.body.duration
    await user.save()
    res.jsend.success(null)
  } catch(err){
    next(err)
  }
}

/**
 * Get a user's usage goal by ID
 * @param req {Object} Request object containing the authenticated user in req.user and the goal id in req.params.goalId
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getUserUsageGoalById = async function(req, res, next){
  const goal = req.user.usageGoals.find(e => String(e._id) === String(req.params.goalId));
  if(!goal){
    const error = new Error('Usage goal not found');
    error.status = 404;
    next(error);
  } else {
    res.jsend.success({usageGoal: goal});
  }
}

/**
 * Delete a user's usage goal by ID
 * @param req {Object} Request object containing the authenticated user in req.user and the goal id in req.params.goalId
 * @param res {Object} Response object with which to send client feedback
 * @param next {Function} Next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.deleteUserUsageGoal = async function(req, res, next){
  try{
    const user = req.user;
    user.usageGoals.pull(req.params.goalId);
    await user.save();
    res.jsend.success(null);
  }catch(err){
    next(err);
  }
}
