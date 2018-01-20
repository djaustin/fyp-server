const User = require('app/models/user');
const Organisation = require('app/models/organisation');
const Application = require('app/models/application')
const Client = require('app/models/client');
const UsageLog = require('app/models/usage-log');
const uid = require('uid2');

async function generate(){
  console.log("starting");
  try{

    console.log("finding user");
    // Get user
    var user = await User.findOne({email: 'dan@mail.com'})
    console.log('Got user', user);
    if(!user){
      user = new User({
        email: 'dan@mail.com',
        password: 'password',
        firstName: 'Dan',
        lastName: 'Austin'
      })
      await user.save()
      console.log("SAVED USER", user);
    }
    let orgNum = uid(10)
    // Create a new organisation
    const organisation = new Organisation({
      name: 'organisation' + orgNum,
      email: 'email' + orgNum,
      password: 'password',
      applicationIds: []
    })
    await organisation.save()
    console.log('Saved org', organisation);
    // Create a random number of applications
    for (var j = 0; j < getRandomInt(5, 10); j++) {
      let appNum = uid(10)
      let application = new Application({
        name: 'application' + appNum,
        clientIds: []
      })
      await application.save()
      console.log('Saved application', application);
      organisation.applicationIds.push(application._id)
      await organisation.save()
      // Create a random number of clients
      for (var k = 0; k < getRandomInt(1, 10); k++) {
        let clientNum = uid(10)

        let platforms = ['ios', 'android', 'blackberry', 'windows-phone', 'desktop', 'browser']
        platform = platforms[getRandomInt(0, platforms.length-1)]
        let client = new Client({
          name: 'client' + clientNum,
          id: 'client' + clientNum,
          secret: 'password',
          applicationId: application._id,
          redirectUri: 'http://localhost',
          isThirdParty: true,
          platform: platform
        })
        await client.save()
        console.log("SAVED CLIENT", client);
        application.clientIds.push(client._id)
        await application.save()

        // Create a random number of usage logs of random lengths at random dates
        for (var l = 0; l < getRandomInt(1, 10); l++) {
          let start = randomDate(new Date(2018, 0, 1), new Date(new Date().getTime() - 1000*60*60))
          let end = randomDate(start, new Date(start.getTime() + 1000*60*60))

          const usageLog = new UsageLog({
            clientId: client._id,
            userId: user._id,
            log: {
              startTime: start,
              endTime: end
            }
          })

          await usageLog.save()
          console.log("USAGE LOG SAVED", usageLog);
        }
      }


    }



  } catch (err){
    console.log("ERROR:", err);
  }
}


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = generate;
