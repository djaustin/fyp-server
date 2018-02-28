const router = require('express').Router({mergeParams: true})
const authentication = require('app/controllers/authentication');
const platformController = require('app/controllers/platform');

router.get('/', authentication.isClientBearerAuthenticated, platformController.getAllPlatforms);

module.exports = router;
