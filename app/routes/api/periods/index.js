const router = require('express').Router({mergeParams: true})
const authentication = require('app/controllers/authentication');
const periodController = require('app/controllers/period');

router.get('/', authentication.isClientBearerAuthenticated, periodController.getAllPeriods);

module.exports = router;
