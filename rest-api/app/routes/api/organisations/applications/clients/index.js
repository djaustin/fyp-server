/**
 * This module mananges routes for the organisations/:organisationId/applications/:applicationId endpoint
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import authentication to restrict access to certain URLs
const authentication = require('app/controllers/authentication');
// Import request controller
const clientController = require('app/controllers/client');

/**
 * Get all clients for the specified application owned by the currently authenticated and authorised organisation
 */
router.get('/', clientController.getApplicationClients);

/**
 * Add a new client to the specified application owned by the currently authenticated and authorised organisation
 */
router.post('/', clientController.newApplicationClient);

/**
 * Get a specific client by ID from the specified application owned by the currently authenticated and authorised organisation
 */
router.get('/:clientId', clientController.getApplicationClient);

module.exports = router;
