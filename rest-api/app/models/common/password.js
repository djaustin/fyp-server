const bcrypt = require('bcrypt');

/**
* Used as a 'pre' condition on saving a mongodb document with a password field. This ensures that any passwords saved to the database are hashed.
* @param callback Function to call after the password has been hashed or an error occurs. The function is the next stage in the saving process.
*/
exports.hashPassword = function(callback){
  // Preserve 'this' as documentInstance object because it gets overridden in the bcrypt functions
  const documentInstance = this;

  // Exit function if the password has not been changed
  if(!documentInstance.isModified('password')){
    return callback();
  }

  // Hash password with bcrypt using 10 salt rounds
  bcrypt.hash(documentInstance.password, 10, function(err, hash){
    if(err){
      // Propagate error to callback if hashing failed
      callback(err);
    } else {
      // Change password string to hashed password
      documentInstance.password = hash;
      callback();
    }
  });
};

/**
* Used to check a plaintext password against the hashed password for the document instance.
* 'this' is the document instance that the function is called on.
* @param passord The plaintext password to verify
* @param callback A function to call when the verification is complete. Error first callback with a second parameter that should contain a boolean representing whether the passwords match.
*/
exports.verifyPassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, match){
    if (err){
      callback(err);
    } else {
      callback(null, match);
    }
  });
}
