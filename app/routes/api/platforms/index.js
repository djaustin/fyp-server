/**
 * This module mananges routes for the platforms endpoint
 */

const router = require('express').Router({mergeParams: true})
const authentication = require('app/controllers/authentication');
const platformController = require('app/controllers/platform');

/**
 * Get all platforms usable with the API
 */
router.get('/', authentication.isClientBearerAuthenticated, platformController.getAllPlatforms);

module.exports = router;
