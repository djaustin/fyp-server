const router = require('express').Router({mergeParams: true});

const authentication = require('app/controllers/authentication');
const organisationController = require('app/controllers/organisation');
const applicationsRouter = require('app/routes/api/organisations/applications')

//TODO: Consider whether these :organisationId endpoints should be authorized i.e. the authorized organisation is the same as the ID being requested.
//TODO: Test whether it is possible to check organisation authetication at this point. It should be? 
router.use('/:organisationId/applications', applicationsRouter);

// ADD A NEW ORGANISATION
router.post('/', organisationController.newOrganisation);

router.get('/:organisationId', organisationController.getOrganisation);

// GET ALL ORGANISATIONS IN DATABASE
router.get('/', authentication.isOrganisationAuthenticated, organisationController.allOrganisations);

module.exports = router;
