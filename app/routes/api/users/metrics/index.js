const router = require('express').Router({mergeParams: true});
const applicationsRouter = require('app/routes/api/users/metrics/applications');
const platformsRouter = require('app/routes/api/users/metrics/platforms');
const overallRouter = require('app/routes/api/users/metrics/overall');
const metricsController = require('app/controllers/metrics');
/**
 * Get an aggregation of all metrics data with optional url query
 */
router.get('/', metricsController.getAggregatedMetrics)

/**
 * Get metrics on an application-by-application basis
 */
router.use('/applications', applicationsRouter);

/**
 * Get metrics on a platform-by-platform basis
 */
router.use('/platforms', platformsRouter)

/**
 * Get overall metrics for this user
 */
router.use('/overall', overallRouter)

module.exports = router;
