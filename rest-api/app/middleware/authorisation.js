const logger = require('app/utils/logger');

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
