const UsageGoal = require('app/models/usage-goal').model;
const Period = require('app/models/period');
const Platform = require('app/models/platform');
const logger = require('app/utils/logger');

exports.getUserUsageGoals = function(req, res, next){
  const goals = req.user.usageGoals;
  res.jsend.success({usageGoals: goals})
}

exports.postUserUsageGoal = async function(req, res, next){
  try {
    let platform;
    if(req.body.platformId){
      platform = await Platform.findOne({_id: req.body.platformId});
      if(!platform){
        let error = new Error('Unable to find platform with ID ' + req.body.platformId)
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
      applicationId: req.body.applicationId,
      period: req.body.periodId,
      duration: req.body.duration
    })
    const goalObj = goal.toObject();
    goalObj.platform = platform;
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
    goal.applicationId = req.body.applicationId
    goal.period = req.body.periodId
    goal.duration = req.body.duration
    await user.save()
    res.jsend.success(null)
  } catch(err){
    next(err)
  }
}

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
