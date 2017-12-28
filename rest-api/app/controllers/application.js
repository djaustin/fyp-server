const Application = require('app/models/application');

// Add an application under an organisation. Uses async keyword because we are using await keyword in the body.
exports.postApplication = async function(req, res){
  const organisation = req.user;
  console.log('Start of postApplication', organisation);
  // Only allow operation if the authenticated organisation is the one to which we are attempting to add an application
  if(organisation._id.toString() !== req.params.organisationId){
    res.status(403);
    return res.json({message: 'Authenticated user is not authorized for that operation.'});
  }

  // Create a new application document from the model. Initialise with provided name and empty client list
  const application = new Application({
    name: req.body.name,
    clients: []
  });

  // 'await' operations in this block are asynchronous. This language structure prevents deep nested callback functions
  try{
    // Save the application to the database
    await application.save();
    // Add the application id to the organisation's application list
    organisation.applications.push(application._id);
    console.log('after pushing application', organisation);
    // Save the organisation
    await organisation.save();
    // Status 201 - Created
    res.status(201);
    // Provide endpoint location for the newly created application
    // TODO: Add another location if applications are available on different routes later
    res.json({
      application: application,
      location: `https://digitalmonitor.tk/api/organisations/${req.params.organisationId}/applications/${application._id}`
    });
  } catch(err){
    // TODO: Improve error handling.
    res.send(err);
  }
};

// Get all applications for a given organisation. The organisation should be authenticated before this call is made.
// Following authentication the req.user object should contain the organisation details but the ID is held in req.params.organisationId as this has passed through the organisation endpoint first.
// eg. <host>/api/organisations/:organisationId/applications
exports.getOrganisationApplications = async function(req, res){
  const organisation = req.user;
  try{
    // Find applications
    const applications = await Application.find({ _id : { $in: organisation.applications } });
    res.json(applications);
  } catch(err){
    res.send(err);
  }
};

exports.getOrganisationApplication = async function(req, res){
  const organisation = req.user;
  try{
    const application = await Application.findOne({_id: req.params.applicationId});
    res.json(application);
  } catch(err){
    res.send(err);
  }
}
