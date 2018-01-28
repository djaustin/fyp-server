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
      user: user,
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
