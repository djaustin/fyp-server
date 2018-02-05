const DeviceToken = require('app/models/deviceToken');

exports.putDeviceToken = async function(req, res, next){
  try{
    const query = {value: req.params.deviceToken};
    const newData = {value: req.params.deviceToken, user: req.body.userId};
    const token = await DeviceToken.findOneAndUpdate(query, newData, {upsert: true});
    res.jsend.success(null);
  } catch(err){
    next(err);
  }
}
