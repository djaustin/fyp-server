/**
 * Controller to manage the handling of requests for the index page
 */

/**
* Retrieve the index page
* @param req {Object} request object containing the authenticated user if one exists
* @param res {Object} Response parameter with which to send result to client
*/
exports.getIndexPage = function(req, res){
  // Render the index.pug template and provide it with the user data
  res.render('index', {user: req.user});
}
