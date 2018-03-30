const router = require('express').Router({mergeParams: true});
const usageGoalController = require('app/controllers/usage-goal');
router.route('/')
  /*
   * Get progress of all usage goals for the authenticated user
   */
  .get(usageGoalController.getUserGoalProgress)

module.exports = router;
