const UsageLog = require('app/models/usage-log');

exports.getAggregatedMetrics = function(req, res, next){
  // TODO: Implement this
}

exports.getAggregatedMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getAggregatedMetrics = function(req, res, next){
  // TODO: Implement this
}

exports.getAggregatedMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationMetricsById = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationMetricsByIdWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationsMetrics = function(req, res, next){
  // TODO: Implement this
}

exports.getApplicationsMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getOverallMetrics = async function(req, res, next){
  try{
    console.log("in getOverallMetrics");
    console.log("About to try to get duration");
    const overallDuration = await UsageLog.getOverallSecondsForUser(req.user._id);
    res.jsend.success({duration: overallDuration})
  } catch(err){
    next(err)
  }
}

exports.getOverallMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformMetricsByName = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformMetricsByNameWithQuery = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformsMetrics = function(req, res, next){
  // TODO: Implement this
}

exports.getPlatformsMetricsWithQuery = function(req, res, next){
  // TODO: Implement this
}
