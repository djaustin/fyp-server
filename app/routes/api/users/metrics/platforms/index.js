const router = require('express').Router({mergeParams: true});
const metricsController = require('app/controllers/metrics');

router.get('/', metricsController.getPlatformsMetrics)
router.get('/:platformId', metricsController.getPlatformMetricsById)

module.exports = router;
