const bcrypt = require('bcrypt');

const logger = require('app/utils/logger');

/**
* Used as a 'pre' condition on saving a mongodb document with a password field. This ensures that any passwords saved to the database are hashed.
* @param callback Function to call after the password has been hashed or an error occurs. The function is the next stage in the saving process.
*/
exports.hashPassword = async function(callback){
  try{
    if (!this.isModified('password')){
      // exit function if password is unchanged
      return callback();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    callback();
  } catch(err){
    logger.error(err);
    callback(err);
  }
};

/**
* Used to check a plaintext password against the hashed password for the document instance.
* 'this' is the document instance that the function is called on.
* @param password The plaintext password to verify
*/
exports.verifyPassword = function(password){
  const documentInstance = this;
  // Return new promise to allow for async/await
  return new Promise(async function(resolve, reject){
    try{
      const match = await bcrypt.compare(password, documentInstance.password);
      resolve(match);
    } catch(err){
      logger.error(err);
      reject(err);
    }
  });
}
