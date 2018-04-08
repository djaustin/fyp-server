const Platform = require('app/models/platform');
const Period = require('app/models/period');

async function generate(){
  try{
    // day
    let dayPeriod = await Period.findOne({key: "day"})

    if(!dayPeriod){
      dayPeriod = new Period({
           "name": "Daily",
           "key": "day",
           "duration": 86400
       })
       await dayPeriod.save()
    }

    // week
    let weekPeriod = await Period.findOne({key: "week"})

    if(!weekPeriod){
      weekPeriod = new Period({
          "name": "Weekly",
          "key": "week",
          "duration": 604800
      })
      await weekPeriod.save()
    }

    // month
    let monthPeriod = await Period.findOne({key: "month"})

    if(!monthPeriod){
      monthPeriod = new Period({
          "name": "Monthly",
          "key": "month",
          "duration": 2592000
      })
      await monthPeriod.save()
    }

    // year
    let yearPeriod = await Period.findOne({key: "year"})

    if(!yearPeriod){
      yearPeriod = new Period({
         "name": "Yearly",
         "key": "year",
         "duration": 31557600
     })
     await yearPeriod.save()
    }

    // iOS
    let iosPlatform = await Platform.findOne({name: "iOS"})

    if(!iosPlatform){
      iosPlatform = new Platform({
          "name": "iOS"
      })
      await iosPlatform.save()
    }

    // Android
    let androidPlatform = await Platform.findOne({name: "Android"})

    if(!androidPlatform){
      androidPlatform = new Platform({
          "name": "Android"
      })
      await iosPlatform.save()
    }

    // Windows Phone
    let windowsPlatform = await Platform.findOne({name: "Windows Phone"})

    if(!windowsPlatform){
      windowsPlatform = new Platform({
          "name": "Windows Phone"
      })
      await windowsPlatform.save()
    }

    // Browser
    let browserPlatform = await Platform.findOne({name: "Browser"})

    if(!browserPlatform){
      browserPlatform = new Platform({
          "name": "Browser"
      })
      await browserPlatform.save()
    }

    // Desktop
    let desktopPlatform = await Platform.findOne({name: "Desktop"})

    if(!desktopPlatform){
      desktopPlatform = new Platform({
          "name": "Desktop"
      })
      await desktopPlatform.save()
    }

    // Blackberry
    let blackberryPlatform = await Platform.findOne({name: "Blackberry"})

    if(!blackberryPlatform){
      blackberryPlatform = new Platform({
          "name": "Blackberry"
      })
      await blackberryPlatform.save()
    }

  } catch (err){
    console.log("ERROR:", err);
  }
}

module.exports = generate;
