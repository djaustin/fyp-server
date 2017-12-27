const router = require('express').Router({mergeParams: true});
const usersRouter = require('app/routes/api/users');
const organisationsRouter = require('app/routes/api/organisations')

console.log('users', usersRouter);
console.log('orgs', organisationsRouter);
router.use('/users', usersRouter);
router.use('/organisations', organisationsRouter);
router.get('/', function(req, res){
  res.json({message: 'Welcome to DigitalMonitor API'})
})
module.exports = router;
