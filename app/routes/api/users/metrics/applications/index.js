const router = require('express').Router({mergeParams: true});
const metricsController = require('app/controllers/metrics');
const query = require('app/middleware/query');

router.get('/', metricsController.getApplicationsMetrics)
router.get('/:applicationId', metricsController.getApplicationMetricsById)

module.exports = router;
