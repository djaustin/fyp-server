const bcrypt = require('bcrypt');

/**
* Used as a 'pre' condition on saving a mongodb document with a password field. This ensures that any passwords saved to the database are hashed.
* @param callback Function to call after the password has been hashed or an error occurs. The function is the next stage in the saving process.
*/
exports.hashPassword = async function(callback){
  // return new Promise(async function(resolve, reject){
  //   // Preserve 'this' as documentInstance object because it gets overridden in the bcrypt functions
  //
  //
  //   // Exit function if the password has not been changed
  //   if(!documentInstance.isModified('password')){
  //     return resolve();
  //   }
  //
  //   try{
  //     const hash = await bcrypt.hash(documentInstance.password, 10);
  //   } catch(err){
  //     reject(err);
  //   }
  try{
    if (!this.isModified('password')){
      console.log('password unchanged');
      // exit function if password is unchanged
      return callback();
    }
    console.log('password was changed when saving', this);
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    callback();
  } catch(err){
    callback(err);
  }
  // // Hash password with bcrypt using 10 salt rounds
  // bcrypt.hash(documentInstance.password, 10, function(err, hash){
  //   if(err){
  //     // Propagate error to callback if hashing failed
  //     callback(err);
  //   } else {
  //     // Change password string to hashed password
  //     documentInstance.password = hash;
  //     callback();
  //   }
  // });
  // });
};

/**
* Used to check a plaintext password against the hashed password for the document instance.
* 'this' is the document instance that the function is called on.
* @param password The plaintext password to verify
* @param callback A function to call when the verification is complete. Error first callback with a second parameter that should contain a boolean representing whether the passwords match.
*/
exports.verifyPassword = function(password){
  const documentInstance = this;
  // Return new promise to allow for async/await
  return new Promise(async function(resolve, reject){
    try{
      const match = await bcrypt.compare(password, documentInstance.password);
      resolve(match);
    } catch(err){
      reject(err);
    }
  });



  // bcrypt.compare(password, this.password, function(err, match){
  //   if (err){
  //     callback(err);
  //   } else {
  //     callback(null, match);
  //   }
  // });
}
