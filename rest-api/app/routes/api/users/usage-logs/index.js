/**
 * This module mananges routes for the users/:userId/usage-logs/ endpoint
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});

// Import request controller
const usageLogController = require('app/controllers/usage-log');

router.route('/')
  /**
   * Get all logs for the currently authenticated and authorised user
   */
  .get(usageLogController.getUserLogs)
  /**
   * Add a new log to the currently authenticated and authorised user
   */
  .post(usageLogController.newUsageLog);
  
/**
 * Get a specific log for the currently authenticated and authorised user by ID
 */
router.get('/:usageLogId', usageLogController.getUserLog);

module.exports = router;
