const Platform = require('app/models/platform');

exports.getAllPlatforms = async function(req, res, next){
  try{
    const platforms = await Platform.find();
    res.jsend.success({platforms: platforms});
  } catch(err){
    next(err);
  }
}
