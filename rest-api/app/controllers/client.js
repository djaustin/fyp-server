const Client = require('app/models/client');
const Application = require('app/models/application');

const logger = require('app/utils/logger');

/**
 * Gets all clients connected to the application provided.
 * @param req Request paramater that contains the application id in req.params.applicationId
 */
// TODO: More checks on null values
exports.getApplicationClients = async function(req, res){
  // TODO: Perhaps consider adding middleware to fetch the application from the db so it doesn't have to be done in all the children requests
  try{
    // Get application instance first
    const application = await Application.findOne({_id: req.params.applicationId});
    // Get clients from the application
    const clients = await Client.find({_id : { $in: application.clients} }, '_id name id');
    res.json(clients);
  } catch(err){
    logger.error(err);
    res.send(err);
  }
}

exports.newApplicationClient = async function(req, res){
  // Create new in-memory client
  const client = new Client({
    name: req.body.name,
    id: req.body.id,
    secret: req.body.secret, //TODO: Think about how this will be generated. It will be hashed in the database but there are probably standards for this kind of thing. Maybe it could just be a GUID and then get sent back in the response
    applicationId: req.params.applicationId,
    redirectUri: req.body.redirectUri
  });
  try{
    // Try to save the new client object
    await client.save();
    // Retrieve the application we are attaching this to
    const application = await Application.findOne({_id: req.params.applicationId});
    // Add the client _id field to the application document
    application.clients.push(client._id);
    // Try to save the application object
    await application.save();
    res.status(201);
    res.json({
      client: client,
      location: `https://digitalmonitor.tk/api/organisations/${req.params.organisationId}/applications/${req.params.applicationId}/clients/${client._id}`
    });
  } catch (err){
    logger.error(err);
    res.status(500);
    res.send(err);
  }
}

exports.getApplicationClient = async function(req, res){
  try{
    const client = await Client.findOne({_id: req.params.clientId}, {secret: 0});
    res.json(client);
  } catch(err){
    logger.error(err);
    res.send(err);
  }
}
