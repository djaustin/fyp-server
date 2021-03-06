const Organisation = require('app/models/organisation');
const Application = require('app/models/application');
const Platform = require('app/models/platform');
const Client = require('app/models/client');
const logger = require('app/utils/logger')

// Ensure the digital monitor iOS client is added automaticall on container start
exports.addIOSClient = async () => {
  const org = new Organisation({
    email: 'admin@digitalmonitor.tk',
    password: 'password',
    name: 'Digital Monitor'
  });

  const platform = await Platform.findOne({name: 'iOS'});

  const app = new Application({
    name: 'Digital Monitor'
  });

  const client = new Client({
    name: 'Digital Monitor iOS',
    id: 'dmios',
    secret: 'password',
    applicationId: app._id,
    redirectUri: 'https://digitalmonitor.tk/',
    isThirdParty: false,
    platform: platform._id
  });
  app.clientIds.push(client._id);
  org.applicationIds.push(app._id);
  try{
    await Promise.all([client.save(), app.save(), org.save()]);
  } catch(err){
    logger.error(err);
  }
}
