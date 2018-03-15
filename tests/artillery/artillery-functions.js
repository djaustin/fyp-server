const moment = require('moment');

exports.generateFromAndToTimeLast7Days = function(requestParams, context, ee, next) {
  const timeNow = new Date().getTime();
  context.vars.fromTime = moment().subtract(1, 'week').valueOf()
  context.vars.toTime = moment().valueOf()
  next()
}


exports.generateStartAndEndTime = function(requestParams, context, ee, next) {
  context.vars.startTime = moment().subtract(1, 'minute').valueOf()
  context.vars.endTime = moment().valueOf()
  next()
}

exports.generateExceptionStartAndEndTime = function(requestParams, context, ee, next) {
  var startMoment = moment().add(getRndInteger(0, 10), 'minutes')
  var endMoment = startMoment.add(getRndInteger(0, 10), 'minutes')
  context.vars.exceptionStartTime = startMoment.valueOf()
  context.vars.exceptionEndTime = endMoment.valueOf()
  next()
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
