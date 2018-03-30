// Import and initialize new express router
const router = require('express').Router({mergeParams: true});

// Import nested routers
const usersRouter = require('app/routes/api/users');
const organisationsRouter = require('app/routes/api/organisations')
const oauth2Router = require('app/routes/api/oauth2');
const usageLogRouter = require('app/routes/api/usage-logs');
const usageLogCollectionsRouter = require('app/routes/api/usage-log-collections');
const applicationsRouter = require('app/routes/api/applications');
const deviceTokensRouter = require('app/routes/api/device-tokens');
const periodsRouter = require('app/routes/api/periods');
const platformsRouter = require('app/routes/api/platforms');

// Mount nested routers onto the endpoints
router.use('/users', usersRouter);
router.use('/organisations', organisationsRouter);
router.use('/oauth2', oauth2Router);
router.use('/usage-logs', usageLogRouter);
router.use('/usage-log-collections', usageLogCollectionsRouter);
router.use('/applications', applicationsRouter);
router.use('/device-tokens', deviceTokensRouter);
router.use('/periods', periodsRouter);
router.use('/platforms', platformsRouter);

router.get('/', function(req, res){
  res.json({message: 'Welcome to DigitalMonitor API'})
});

module.exports = router;
