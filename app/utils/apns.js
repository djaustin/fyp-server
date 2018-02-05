const apn = require('apn');

var options = {
  token: {
    key: __basedir + "/AuthKey_4JB9YML372.p8",
    keyId: "4JB9YML372",
    teamId: "C9B2KZDAUR"
  },
  production: false
};

var apnProvider = new apn.Provider(options);
module.exports = apnProvider;
