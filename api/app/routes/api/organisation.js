const router = require('express').Router();

const authentication = require('app/controllers/authentication');
const organisationController = require('app/controllers/organisation');

// ADD A NEW ORGANISATION
router.post('/', organisationController.newOrganisation);

router.get('/:id')

// GET ALL ORGANISATIONS IN DATABASE
router.get('/', authentication.isOrganisationAuthenticated, organisationController.allOrganisations);

module.exports = router;
