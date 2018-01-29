const router = require('express').Router({mergeParams: true});
const applicationController = require('app/controllers/application');
router.route('/')
  /**
   * Get all applications able to create usage logs for the authenticated user
   */
  .get(applicationController.getUserAuthorisedApplications)

module.exports = router;
