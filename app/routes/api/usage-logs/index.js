/**
 * This module mananges routes for the usage-logs endpoint
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
const authentication = require('app/controllers/authentication');
// Import request controller
const usageLogController = require('app/controllers/usage-log');

router.route('/')
  /**
   * Add a new log to the currently authenticated and authorised user
   */
  .post(authentication.isUserAuthenticated, usageLogController.newUsageLog);

module.exports = router;
