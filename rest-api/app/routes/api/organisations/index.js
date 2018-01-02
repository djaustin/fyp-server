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
router.post('/', organisationController.newOrganisation);

/**
 * Get the details of a specific organisation by ID. Requires authenticated and authorised organisation.
 */
router.get('/:organisationId', authentication.isOrganisationAuthenticated, orgIdMatchesAuthenticatedOrg, organisationController.getOrganisation);

//TODO: Remove this in prod probably
// GET ALL ORGANISATIONS IN DATABASE
router.get('/', authentication.isOrganisationAuthenticated, organisationController.allOrganisations);

module.exports = router;
