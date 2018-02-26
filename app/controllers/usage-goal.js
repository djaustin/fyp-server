const UsageGoal = require('app/models/usage-goal').model;
const logger = require('app/utils/logger');

exports.getUserUsageGoals = function(req, res, next){
  const goals = req.user.usageGoals;
  res.jsend.success({usageGoals: goals})
}

exports.postUserUsageGoal = async function(req, res, next){
  try {
    const user = req.user
    const goal = new UsageGoal({
      platform: req.body.platform,
      applicationId: req.body.applicationId,
      period: req.body.period,
      duration: req.body.duration
    })
    user.usageGoals.push(goal)
    await user.save()
    res.status(201)
    res.jsend.success({
      usageGoal: goal,
      locations: [
        "https://digitalmonitor.tk/api/users/" + user._id + "/usage-goals" + goal._id + "/"
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
      results.push(goalObj)
    }
    res.jsend.success({usageGoals: results})
  } catch(err){
    next(err)
  }
}

exports.putUserUsageGoal = async function(req, res, next){
  try{
    const user = req.user
    const goal = req.user.usageGoals.id(req.params.goalId)
    if(!goal){
      let err = new Error("Usage goal not found")
      err.status = 404
      throw err
    }
    goal.platform = req.body.platform
    goal.applicationId = req.body.applicationId
    goal.period = req.body.period
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
