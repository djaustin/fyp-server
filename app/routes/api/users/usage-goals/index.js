const router = require('express').Router({mergeParams: true});
const usageGoalsController = require('app/controllers/usage-goal');
const progressRouter = require('app/routes/api/users/usage-goals/progress');

// Mount progress router to the progress endpoint
router.use('/progress', progressRouter)

router.route('/')
  /*
   * Get all usage goals for the authenticated user
   */
  .get(usageGoalsController.getUserUsageGoals)
  /*
   * Add a new usage goal to the authenticated user
   */
  .post(usageGoalsController.postUserUsageGoal);

router.route('/:goalId')
  /*
   * Get usage goal details by goal ID
   */
  .get(usageGoalsController.getUserUsageGoalById)
  /*
   * Edit usage goal details by goal ID
   */
  .put(usageGoalsController.putUserUsageGoal)
  /*
   * Delete usage goal by goal ID
   */
  .delete(usageGoalsController.deleteUserUsageGoal);
module.exports = router;
