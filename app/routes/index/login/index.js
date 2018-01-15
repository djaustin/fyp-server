const router = require('express').Router({mergeRoutes: true});
const loginController = require('app/controllers/login');

router.route('/')
  .get(loginController.getLoginPage)
  .post(loginController.postLoginPage);

module.exports = router;
