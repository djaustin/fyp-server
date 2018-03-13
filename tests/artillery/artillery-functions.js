const moment = require('moment');

exports.generateFromAndToTimeLast7Days = function(requestParams, context, ee, next) {
  const timeNow = new Date().getTime();
  context.vars.fromTime = moment().subtract(1, 'week').valueOf()
  context.vars.toTime = moment().valueOf()
  next()
}


exports.generateStartAndEndTime = function(requestParams, context, ee, next) {
  context.vars.startTime = moment().subtract(10, 'seconds').valueOf()
  context.vars.endTime = moment().valueOf()
  next()
}
