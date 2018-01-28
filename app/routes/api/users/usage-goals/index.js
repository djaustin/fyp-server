const router = require('express').Router({mergeParams: true});
const usageGoalsController = require('app/controllers/usage-goal');
const progressRouter = require('app/routes/api/users/usage-goals/progress');
router.route('/')
  .get(usageGoalsController.getUserUsageGoals)
  .post(usageGoalsController.postUserUsageGoal)
  // .put()
  // .delete()


router.use('/progress', progressRouter)
module.exports = router;