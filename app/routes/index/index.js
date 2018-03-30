const router = require('express').Router({mergeParams: true});
const indexController = require('app/controllers/index');
const loginRouter = require('app/routes/index/login');

/*
 * Get the root page of the site
 */
router.get('/', indexController.getIndexPage);

/*
 * Mount the login router to the login endpoint
 */
router.use('/login', loginRouter);

module.exports = router;
