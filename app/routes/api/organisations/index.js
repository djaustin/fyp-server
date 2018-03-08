/**
 * This module mananges routes for the organisations endpoint and nested routes
 */

// Import and initialize new express router
const router = require('express').Router({mergeParams: true});
// Import authentication to restrict access to certain URLs
const authentication = require('app/controllers/authentication');
// Import request controller
const organisationController = require('app/controllers/organisation');
// Import nested router
const applicationsRouter = require('app/routes/api/organisations/applications');

// Middleware that checks whether the organisation id of the authenticated organisation is the same as the organisationId in the URL being requested.
const orgIdMatchesAuthenticatedOrg = require('app/middleware/authorisation').authenticatedUserOwnsResource('organisationId');

/**
 * Mount the nested router onto this endpoint. All endpoints in this nested router require organisation authentication
 */
router.use('/:organisationId/applications', authentication.isOrganisationAuthenticated, orgIdMatchesAuthenticatedOrg, applicationsRouter);

/**
 * Add a new organisation to the application.
 */
router.route('/')
  /**
   * Add a new organisation to the application.
   */
  .post(authentication.isClientBearerAuthenticated, organisationController.newOrganisation)
  /**
   * Get organistions by query provided in the url
   */
  .get(authentication.isOrganisationAuthenticated, organisationController.getOrganisations);


router.route('/:organisationId')
  /**
   * Get the details of a specific organisation by ID. Requires authenticated and authorised organisation.
   */
  .get(authentication.isOrganisationAuthenticated, orgIdMatchesAuthenticatedOrg, organisationController.getOrganisation)
  /**
   * Delete an organisation by ID. Must be authenticated and authorized as that organisation
   */
  .delete(authentication.isOrganisationAuthenticated, orgIdMatchesAuthenticatedOrg, organisationController.deleteOrganisation)
  /**
   * Edit an organisation's details by ID. Must be authenticated and authorized as that organisation
   */
  .put(authentication.isOrganisationAuthenticated, orgIdMatchesAuthenticatedOrg, organisationController.editOrganisation);


module.exports = router;
