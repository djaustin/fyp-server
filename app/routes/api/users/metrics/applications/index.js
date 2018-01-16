const router = require('express').Router({mergeParams: true});
const metricsController = require('app/controllers/metrics');
const query = require('app/middleware/query');

router.get('/', query.runIfQueryExists(metricsController.getApplicationsMetricsWithQuery), metricsController.getApplicationsMetrics)
router.get('/:applicationId', query.runIfQueryExists(metricsController.getApplicationMetricsByIdWithQuery), metricsController.getApplicationMetricsById)

module.exports = router;
