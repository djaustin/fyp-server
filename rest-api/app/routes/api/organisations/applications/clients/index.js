const router = require('express').Router({mergeParams: true});
const authentication = require('app/controllers/authentication');
const clientController = require('app/controllers/client');

// Make sure that organisation is authenticated then get all the clients for the application specified in the endpoint
router.get('/', authentication.isOrganisationAuthenticated, clientController.getApplicationClients);

router.post('/', authentication.isOrganisationAuthenticated, clientController.newApplicationClient);

router.get('/:clientId', authentication.isOrganisationAuthenticated, clientController.getApplicationClient);

module.exports = router;
