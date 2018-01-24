// Import and initialize new express router
const router = require('express').Router({mergeParams: true});

// Import nested routers
const usersRouter = require('app/routes/api/users');
const organisationsRouter = require('app/routes/api/organisations')
const oauth2Router = require('app/routes/api/oauth2');
const usageLogRouter = require('app/routes/api/usage-logs');

// Mount nested routers onto the endpoints
router.use('/users', usersRouter);
router.use('/organisations', organisationsRouter);
router.use('/oauth2', oauth2Router);
router.use('/usage-logs', usageLogRouter)

// NOTE: Just here for testing. Could almost definitely have something more useful
router.get('/', function(req, res){
  res.json({message: 'Welcome to DigitalMonitor API'})
});

module.exports = router;
