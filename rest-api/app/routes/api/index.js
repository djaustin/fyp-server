const router = require('express').Router({mergeParams: true});
const usersRouter = require('app/routes/api/users');
const organisationsRouter = require('app/routes/api/organisations')
const oauth2Router = require('app/routes/api/oauth2');
router.use('/users', usersRouter);
router.use('/organisations', organisationsRouter);
router.use('/oauth2', oauth2Router);
router.get('/', function(req, res){
  res.json({message: 'Welcome to DigitalMonitor API'})
})
module.exports = router;
