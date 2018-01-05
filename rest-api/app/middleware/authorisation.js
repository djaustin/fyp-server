/**
 * This module provides middleware as a more convenient way to check that an authenticated user is authorized to access a resource.
 * For example, if /users/1234 is accessed, it can be checked that user 1234 has been authenicated on the request
 */

/**
 * Checks that the authenticated user has the same ID as the resource being accessed.
 * If they are the same, the next middleware is called.
 * If they are not the same, a 403 error witha message is returned in the response
 * @param paramIdName {String} The name of the ID parameter in the URL
 */
exports.authenticatedUserOwnsResource = function(paramIdName){
  return function(req, res, next){
    const authenticatedId = req.user._id;
    const requestId = req.params[paramIdName];

    if(authenticatedId != requestId){
      respondUserNotAuthorised(res);
    } else {
      next();
    }
  }
};

exports.organisationOwnsApplication = function(req, res, next){
  const organisation = req.organisation;

  // ObjectIDs are not stored as strings in the document. We must call the equals function on each application
  if(!organisation.applicationIds.some((applicationId) => applicationId.equals(req.params.applicationId))){
    respondUserNotAuthorised(res);
  } else {
    next();
  }
}

function respondUserNotAuthorised(res){
  res.status(403);
  res.json({message: 'Authenticated user is not authorized for that operation.'});
}
