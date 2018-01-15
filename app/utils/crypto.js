const bcrypt = require('bcrypt');

const logger = require('app/utils/logger');

/**
 * Convenience function to allow aynchronous hashing of a secret value in a mongoose model
 * @param secretName {String} The name of the secret value to be hashed (eg. 'password' or 'secret')
 */
exports.hashSecret = function(secretName){
  return async function(callback){
    try{
      if (!this.isModified(secretName)){
        // exit function if secretName is unchanged
        return callback();
      }
      const hash = await bcrypt.hash(this[secretName], 10);
      this[secretName] = hash;
      callback();
    } catch(err){
      logger.error(err);
      callback(err);
    }
  };
}


/**
* Convenience function to allow a secret hashed value of a mongoose model to be easily verified.
* This function takes an initialisation parameter and returns a function that can be used to check plaintext against the hashed version stored
* @param secretName {String} The name of the property of the mongoose document containing the secret value (eg. 'password')
*/
exports.verifySecret = function(secretName){
  return function(secretPlainText){
    documentInstance = this;
    // Return new promise to allow for async/await
    return new Promise(async function(resolve, reject){
      try{
        const match = await bcrypt.compare(secretPlainText, documentInstance[secretName]);
        resolve(match);
      } catch(err){
        logger.error(err);
        reject(err);
      }
    });
  }
}
