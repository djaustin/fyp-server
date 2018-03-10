const router = require('express').Router({mergeParams: true});
const monitoringExceptionController = require('app/controllers/monitoring-exception');

router.route('/')
  .get(monitoringExceptionController.getUserMonitoringExceptions)
  .post(monitoringExceptionController.postUserMonitoringException);

router.route('/:exceptionId')
  .get(monitoringExceptionController.getUserMonitoringExceptionById)
  .put(monitoringExceptionController.putUserMonitoringException)
  .delete(monitoringExceptionController.deleteUserMonitoringException);

module.exports = router;
