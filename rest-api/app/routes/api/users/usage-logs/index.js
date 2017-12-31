const router = require('express').Router({mergeParams: true});
const usageLogController = require('app/controllers/usage-log');
const authentication = require('app/controllers/authentication');

router.get('/', usageLogController.getUserLogs);
router.post('/', authentication.isBearerAuthenticated, usageLogController.newUsageLog);
router.get('/:usageLogId', usageLogController.getUserLog);

module.exports = router;
