/**
 * This module mananges routes for the organisations/:organisationId/applications/:applicationId endpoint
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import authentication to restrict access to certain URLs
const authentication = require('app/controllers/authentication');
// Import request controller
const clientController = require('app/controllers/client');


router.route('/')
  /**
   * Get all clients for the specified application owned by the currently authenticated and authorised organisation
   */
  .get(clientController.getApplicationClients)
  /**
   * Add a new client to the specified application owned by the currently authenticated and authorised organisation
   */
  .post(clientController.newApplicationClient);

router.route('/:clientId')
  /**
   * Get a specific client by ID from the specified application owned by the currently authenticated and authorised organisation
   */
  .get(clientController.getApplicationClient)
  /**
   * Delete a specific client by ID from the specified application owned by the currently authenticated and authorised organisation
   */
  .delete(clientController.deleteApplicationClient)
  /**
   * Edit a specific client by ID from the specified application owned by the currently authenticated and authorised organisation
   */
  .put(clientController.editApplicationClient);

module.exports = router;
