const router = require('express').Router({mergeParams: true});
const metricsController = require('app/controllers/metrics');

router.get('/', metricsController.getPlatformsMetrics)
router.get('/:platformName', metricsController.getPlatformMetricsByName)

module.exports = router;
