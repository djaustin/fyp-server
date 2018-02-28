const Period = require('app/models/period');

exports.getAllPeriods = async function(req, res, next){
  try{
    const periods = await Period.find();
    res.jsend.success({periods: periods});
  } catch(err){
    next(err);
  }
}
