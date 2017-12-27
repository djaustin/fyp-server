const router = require('express').Router();

const authentication = require('../../controllers/authentication');
const organisationController = require('../../controllers/organisation');

// ADD A NEW ORGANISATION
router.post('/', organisationController.newOrganisation);

// GET ALL ORGANISATIONS IN DATABASE
router.get('/', authentication.isOrganisationAuthenticated, organisationController.allOrganisations);

module.exports = router;
