const router = require('express').Router({mergeParams: true});
const metricsController = require('app/controllers/metrics');
const query = require('app/middleware/query');

router.get('/', query.runIfQueryExists(metricsController.getPlatformsMetricsWithQuery), metricsController.getPlatformsMetrics)
router.get('/:platformName', query.runIfQueryExists(metricsController.getPlatformMetricsByNameWithQuery), metricsController.getPlatformMetricsByName)

module.exports = router;
