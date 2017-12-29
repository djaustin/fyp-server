const router = require('express').Router({mergeParams: true});
const authentication = require('app/controllers/authentication');
const applicationController = require('app/controllers/application');
const clientsRouter = require('app/routes/api/organisations/applications/clients');

router.get('/', authentication.isOrganisationAuthenticated, applicationController.getOrganisationApplications);
router.post('/', authentication.isOrganisationAuthenticated, applicationController.postApplication);
router.get('/:applicationId', authentication.isOrganisationAuthenticated, applicationController.getOrganisationApplication);
router.use('/:applicationId/clients', clientsRouter);
module.exports = router;
