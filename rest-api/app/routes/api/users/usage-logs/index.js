const router = require('express').Router({mergeParams: true});
const usageLogController = require('app/controllers/usage-log');


router.get('/', usageLogController.getUserLogs);
router.post('/', usageLogController.newUsageLog);
router.get('/:usageLogId', usageLogController.getUserLog);

module.exports = router;
