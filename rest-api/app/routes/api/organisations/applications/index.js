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
const authorisation = require('app/middleware/authorisation');

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
  .get(authorisation.organisationOwnsApplication, applicationController.getOrganisationApplication)
  /**
   * Delete an application by ID owned by the currently authenticated and authorised organisation
   */
  .delete(authorisation.organisationOwnsApplication, applicationController.deleteOrganisationApplication)
  /**
   * Edit an application by ID owned by the currently authenticated and authorised organisation
   */
  .patch(authorisation.organisationOwnsApplication, applicationController.editOrganisationApplication);

/**
 * Mount the nested router to this endpoint
 */
router.use('/:applicationId/clients', authorisation.organisationOwnsApplication, clientsRouter);

module.exports = router;
