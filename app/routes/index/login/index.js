const router = require('express').Router({mergeRoutes: true});
const loginController = require('app/controllers/login');

router.route('/')
  /*
   * Get the login page
   */
  .get(loginController.getLoginPage)
  /*
   * Post login details from the form 
   */
  .post(loginController.postLoginPage);

module.exports = router;
