const router = require('express').Router({mergeParams: true});
const usageGoalsController = require('app/controllers/usage-goal');
const progressRouter = require('app/routes/api/users/usage-goals/progress');
router.use('/progress', progressRouter)
router.route('/')
  .get(usageGoalsController.getUserUsageGoals)
  .post(usageGoalsController.postUserUsageGoal);

router.route('/:goalId')
  .get(usageGoalsController.getUserUsageGoalById)
  .put(usageGoalsController.putUserUsageGoal)
  .delete(usageGoalsController.deleteUserUsageGoal);
module.exports = router;
