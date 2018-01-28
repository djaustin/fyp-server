const router = require('express').Router({mergeParams: true});
const usageGoalController = require('app/controllers/usage-goal');
router.route('/')
  .get(usageGoalController.getUserGoalProgress)

module.exports = router;
