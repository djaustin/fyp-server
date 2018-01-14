const Organisation = require('app/models/organisation');
const Application = require('app/models/application');
const Client = require('app/models/client');

exports.addIOSClient = async () => {
  const org = new Organisation({
    email: 'admin@digitalmonitor.tk',
    password: 'password',
    name: 'Digital Monitor'
  });

  const app = new Application({
    name: 'Digital Monitor'
  });

  const client = new Client({
    name: 'Digital Monitor iOS',
    id: 'dmios',
    secret: 'password',
    applicationId: app._id,
    redirectUri: 'https://digitalmonitor.tk/'
  });
  app.clientIds.push(client._id);
  org.applicationIds.push(app._id);
  try{
    await Promise.all([client.save(), app.save(), org.save()]);
  } catch(err){
    logger.error(err);
  }
}
