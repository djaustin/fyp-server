/**
 * Controller to manage the handling of requests to endpoints for the Application resource.
 */

// Import data model for mongodb interface
const Application = require('app/models/application');

/**
 * Create a new application. Application name is provided in the req.body object
 */
exports.postApplication = async function(req, res){
  const organisation = req.user;

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
    // Save the organisation
    await organisation.save();
    // Status 201 - Created
    res.status(201);
    // Provide endpoint location for the newly created application
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

/**
 * Retrieve a single application belonging to the authenticated organisation by ID
 */
exports.getOrganisationApplication = async function(req, res){
  const organisation = req.user;
  try{
    const application = await Application.findOne({_id: req.params.applicationId});
    res.json(application);
  } catch(err){
    res.send(err);
  }
}
