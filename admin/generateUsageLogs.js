const User = require('app/models/user');
const Platform = require('app/models/platform');
const Period = require('app/models/period');
const Organisation = require('app/models/organisation');
const Application = require('app/models/application')
const Client = require('app/models/client');
const UsageLog = require('app/models/usage-log');
const RefreshToken = require('app/models/refreshToken');
const UsageGoal = require('app/models/usage-goal').model;
const uid = require('uid2');
let appNames = ["Amazon Kindle","Android Device Manager","Android Pay","Any.do","Avast Mobile Security","Blendle","CamScanner","Duolingo","ESPN","Facebook Messenger","Flamingo","Flipboard","GBoard","Google Chrome","Google Drive","Google Fit","Google Maps","Google Photos","Google Translate","GrubHub","Headspace","IFTTT","Inbox by Gmail","Instagram","LastPass"]


async function generate(){
  try{
    let platforms = await Platform.find();
    let periods = await Period.find();

    // Get user
    var user = await User.findOne({email: 'dan@mail.com'})
    if(!user){
      user = new User({
        email: 'dan@mail.com',
        password: 'password',
        firstName: 'Dan',
        lastName: 'Austin'
      })
      await user.save()
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
    // Create a random number of applications
    for (var j = 0; j < getRandomInt(5, 10); j++) {
      let appNum = uid(10)
      let appName = appNames[getRandomInt(0, appNames.length)]
      appNames = appNames.filter(e => e !== appName)
      let application = new Application({
        name: appName,
        clientIds: []
      })
      await application.save()

      organisation.applicationIds.push(application._id)
      await organisation.save()
      // Create a random number of clients
      for (var k = 0; k < getRandomInt(1, 10); k++) {
        let clientNum = uid(10)
        platform = platforms[getRandomInt(0, platforms.length-1)]
        let client = new Client({
          name: 'client' + clientNum,
          id: 'client' + clientNum,
          secret: 'password',
          applicationId: application._id,
          redirectUri: 'http://localhost',
          isThirdParty: true,
          platform: platform._id
        })
        await client.save()
        application.clientIds.push(client._id)
        await application.save()
        let refreshToken = new RefreshToken({
          value: uid(16),
          userId: user._id,
          clientId: client._id
        });

        await refreshToken.save();

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
