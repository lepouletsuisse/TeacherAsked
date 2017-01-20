var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';
var collection = process.env.MONGODB_COLLECTION || "teacherasked";
var mongoURI = process.env.MONGODB_URI || "mongodb://192.168.99.100/" + collection,
//var username = process.env.MONGODB_USERNAME || "user";
//var password = process.env.MONGODB_PASSWORD || "123soleil";
//var suffix = process.env.MONGODB_SUFFIX || "";

var config = {
  development: {
    root: rootPath,
    app: {
      name: collection + '-dev'
    },
    port: process.env.PORT || 3000,
    collection: collection + '-dev',
    db: mongoURI,
    //db: 'mongodb://' + MONGODB_USERNAME + ':' + MONGODB_PASSWORD + '@' + suffix + '/' + collection + '-dev',
    socketIoURL: process.env.SOCKETIOURL || 'http://localhost:3000',
    jwtsecret: process.env.JWTSECRET ||'supersecretsharedkey'
},

  test: {
    root: rootPath,
    app: {
      name: collection + '-test'
    },
    port: process.env.PORT || 3000,
    collection: collection + '-test',
    db: mongoURI,
    //db: 'mongodb://' + MONGODB_USERNAME + ':' + MONGODB_PASSWORD + '@' + suffix + '/' + collection + '-test',
    socketIoURL: process.env.SOCKETIOURL || 'http://localhost:3000',
    jwtsecret: process.env.JWTSECRET ||'supersecretsharedkey'
  },

  production: {
    root: rootPath,
    app: {
      name: collection + '-prod'
    },
    port: process.env.PORT || 3000,
    collection: collection + '-prod',
    db: mongoURI,
    //db: 'mongodb://' + MONGODB_USERNAME + ':' + MONGODB_PASSWORD + '@' + suffix + '/' + collection + '-prod',
    socketIoURL: process.env.SOCKETIOURL || 'http://localhost:3000',
    jwtsecret: process.env.JWTSECRET ||'supersecretsharedkey'
  }
};

module.exports = config[env];
