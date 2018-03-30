const router = require('express').Router({mergeParams: true});
const metricsController = require('app/controllers/metrics');
const query = require('app/middleware/query');

/*
 * Get overall user metrics for the authenticated use 
 */
router.get('/', metricsController.getOverallMetrics)

module.exports = router;
