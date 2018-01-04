/**
 * Controller to manage the handling of requests to endpoints for the Application resource.
 */

// Import data model for mongodb interface
const Application = require('app/models/application');

/**
  Add a new application to the database under the given authenticated and authorized organisation
  @param req {Object} request object containing the authenticated organisation in req.user
  @param res {Object} respnse object with which to send client feedback
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
    // Provide endpoint locations for the newly created application
    res.jsend.success({
      application: application,
      locations: [`https://digitalmonitor.tk/api/organisations/${req.params.organisationId}/applications/${application._id}`]
    });
  } catch(err){
    // TODO: Improve error handling.
    res.jsend.error(err);
  }
};


/**
 * Get all applications for a given organisation.
 * @param req {Object} request object containing the organisation object in req.user
 * @param res {Object} response object with which to send client feedback.
 */
exports.getOrganisationApplications = async function(req, res){
  const organisation = req.user;
  try{
    // Find applications
    const applications = await Application.find({ _id : { $in: organisation.applications } });
    res.jsend.success({applications: applications});
  } catch(err){
    res.jsend.error(err);
  }
};

/**
 * Retrieve a single application belonging to the authenticated organisation by ID.
 * @param req {Object} request object containing the applicationId in req.params
 * @param res {Object} response object with which to send client feedback
 */
exports.getOrganisationApplication = async function(req, res){
  try{
    const application = await Application.findOne({_id: req.params.applicationId});
    res.jsend.success({application: application});
  } catch(err){
    res.jsend.error(err);
  }
}

/**
 * Delete an organisation application by id.
 * @param req Request parameter containing the applicationId in req.parameters
 * @param res Response parameter with which to send result to client
 */
exports.deleteOrganisationApplication = async function(req, res){
  const organisation = req.user;
  try{
    await Application.remove({_id: req.params.applicationId})
    res.jsend.success(null);
  } catch (err){
    res.jsend.error(err);
  }
}
