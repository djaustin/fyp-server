const router = require('express').Router({mergeParams: true})
const authentication = require('app/controllers/authentication');
const deviceTokenController = require('app/controllers/deviceToken');

/**
 * Update device token details
 */
router.put('/:deviceToken', authentication.isClientBearerAuthenticated, deviceTokenController.putDeviceToken);

module.exports = router;
