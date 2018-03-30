const router = require('express').Router({mergeParams: true});
const applicationController = require('app/controllers/application');
const authentication = require('app/controllers/authentication');

/**
 * Get application details by application ID
 */
router.get('/:applicationId', authentication.isClientBearerAuthenticated, applicationController.getApplicationById)

module.exports = router;
