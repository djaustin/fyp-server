const router = require('express').Router({mergeParams: true});
const metricsController = require('app/controllers/metrics');
const query = require('app/middleware/query');

/*
 * Get all application metrics
 */
router.get('/', metricsController.getApplicationsMetrics)
/*
 * Get metrics for an application by ID
 */
router.get('/:applicationId', metricsController.getApplicationMetricsById)

module.exports = router;
