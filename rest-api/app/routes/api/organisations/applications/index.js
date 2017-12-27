const router = require('express').Router({mergeParams: true});
const authentication = require('app/controllers/authentication');
const applicationController = require('app/controllers/application');

router.get('/', authentication.isOrganisationAuthenticated, applicationController.getOrganisationApplications);
router.post('/', authentication.isOrganisationAuthenticated, applicationController.postApplication);

module.exports = router;
