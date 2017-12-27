const router = require('express').Router({mergeParams: true});

const authentication = require('app/controllers/authentication');
const organisationController = require('app/controllers/organisation');
const applicationsRouter = require('app/routes/api/organisations/applications')

router.use('/:organisationId/applications', applicationsRouter);

// ADD A NEW ORGANISATION
router.post('/', organisationController.newOrganisation);

router.get('/:organisationId', organisationController.getOrganisation);

// GET ALL ORGANISATIONS IN DATABASE
router.get('/', authentication.isOrganisationAuthenticated, organisationController.allOrganisations);

module.exports = router;
