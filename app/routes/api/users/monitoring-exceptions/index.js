const router = require('express').Router({mergeParams: true});
const monitoringExceptionController = require('app/controllers/monitoring-exception');

router.route('/')
  /*
   * Get all monitoring exceptions for the authenticated user
   */
  .get(monitoringExceptionController.getUserMonitoringExceptions)
  /*
   * Add a new monitoring exception for the authenticated user
   */
  .post(monitoringExceptionController.postUserMonitoringException);

router.route('/:exceptionId')
  /*
   * Get monitoring exception details by exception ID
   */
  .get(monitoringExceptionController.getUserMonitoringExceptionById)
  /*
   * Edit the details of an existing monitoring exception by exception ID
   */
  .put(monitoringExceptionController.putUserMonitoringException)
  /*
   * Delete an existing monitoring exception by exception ID
   */
  .delete(monitoringExceptionController.deleteUserMonitoringException);

module.exports = router;
