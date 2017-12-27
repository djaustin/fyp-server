const Application = require('app/models/application');

// Add an application under an organisation
exports.postApplication = async function(req, res){
  const organisation = req.user;
  if(organisation._id.toString() !== req.params.organisationId){
    res.status = 403
    return res.json({message: 'Authenticated user is not authorized for that operation.'})
  }
  const application = new Application({
    name: req.body.name,
    clients: []
  });

  application.save(function(err){
    if(err){
      res.send(err);
    } else {
      organisation.applications.push(application._id);
      organisation.save(function(err){
        if(err){
          res.send(err);
        } else {
          res.status = 201;
          res.json({
            location: `https://digitalmonitor.tk/api/organisations/${req.params.organisationId}/applications/${application._id}`
          })
        }
      })
    }
  });

};

// Get all applications for a given organisation. The organisation should be authenticated before this call is made.
// Following authentication the req.user object should contain the organisation details but the ID is held in req.params.organisationId as this has passed through the organisation endpoint first.
// eg. <host>/api/organisations/:organisationId/applications
exports.getOrganisationApplications = async function(req, res){

  const organisation = req.user;
  Application.find({
    _id : {
      $in: organisation.applications
    }
  }, function(err, applications){
    if(err){
      res.send(err);
    } else {
      res.json(applications);
    }
  });
};
