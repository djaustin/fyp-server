const router = require('express').Router({mergeParams: true});
const metricsController = require('app/controllers/metrics');
const query = require('app/middleware/query');

router.get('/', query.runIfQueryExists(metricsController.getOverallMetricsWithQuery), metricsController.getOverallMetrics)

module.exports = router;
