/**
 * This module mananges routes for the periods endpoint
 */

const router = require('express').Router({mergeParams: true})
const authentication = require('app/controllers/authentication');
const periodController = require('app/controllers/period');

/**
 * Get all periods usable with the API
 */
router.get('/', authentication.isClientBearerAuthenticated, periodController.getAllPeriods);

module.exports = router;
