var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';
var mongoURI = process.env.MANGODBURI || "192.168.99.100";
var labName = "TWEB2";
var collection = labName + "";

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'tweb-labo2-dev'
    },
    port: process.env.PORT || 3000,
    collection: labName + '-dev',
    db: 'mongodb://' + mongoURI + '/' + labName + '-dev',
    socketIoURL: process.env.SOCKETIOURL || 'http://localhost:3000',
    jwtsecret: process.env.JWTSECRET ||'supersecretsharedkey'
},

  test: {
    root: rootPath,
    app: {
      name: 'tweb-labo2-test'
    },
    port: process.env.PORT || 3000,
    collection: labName + '-test',
    db: 'mongodb://' + mongoURI + '/' + labName + '-test',
    socketIoURL: process.env.SOCKETIOURL || 'http://localhost:3000',
    jwtsecret: process.env.JWTSECRET ||'supersecretsharedkey'
  },

  production: {
    root: rootPath,
    app: {
      name: 'tweb-labo2-prod'
    },
    port: process.env.PORT || 3000,
    collection: labName + '-prod',
    db: 'mongodb://' + mongoURI + '/' + labName + '-prod',
    socketIoURL: process.env.SOCKETIOURL || 'http://localhost:3000',
    jwtsecret: process.env.JWTSECRET ||'supersecretsharedkey'
  }
};

module.exports = config[env];
