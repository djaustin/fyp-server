const router = require('express').Router({mergeParams: true});
const clientController = require('app/controllers/client');

/**
 * Get all user clients or clients matching query filter
 */
router.get('/', clientController.getUserClients)

/**
 * Revoke client access to a user's resources. Access is granted via the oauth2 endpoints
 */
router.delete('/:clientId', clientController.revokeClientAccess)


module.exports = router;
