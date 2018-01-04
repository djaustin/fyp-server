/**
 * This module mananges routes for the organisations/:organisationId/applications endpoint and nested routes.
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import authentication to restrict access to certain URLs
const authentication = require('app/controllers/authentication');
// Import request controller
const applicationController = require('app/controllers/application');
// Import nested router
const clientsRouter = require('app/routes/api/organisations/applications/clients');


router.route('/')
  /**
   * Get all applications for the currently authenticated and authorised organisation
   */
  .get(applicationController.getOrganisationApplications)
  /**
   * Add a new application to the currently authenticated and authorised organisation
   */
  .post(applicationController.postApplication);



router.route('/:applicationId')
  /**
   * Get an application by ID owned by the currently authenticated and authorised organisation
   */
  .get(applicationController.getOrganisationApplication)
  /**
   * Delete an application by ID owned by the currently authenticated and authorised organisation
   */
  .post(applicationController.deleteOrganisationApplication);

/**
 * Mount the nested router to this endpoint
 */
router.use('/:applicationId/clients', clientsRouter);

module.exports = router;
