const router = require('express').Router({mergeParams: true});
const indexController = require('app/controllers/index');
const loginRouter = require('app/routes/index/login');

router.get('/', indexController.getIndexPage);

router.use('/login', loginRouter);

module.exports = router;
