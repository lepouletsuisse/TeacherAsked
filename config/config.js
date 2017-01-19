var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';
var mongoURI = process.env.MANGODB_URI || "192.168.99.100";
var collection = "TeacherAsked";

var config = {
  development: {
    root: rootPath,
    app: {
      name: collection + '-dev'
    },
    port: process.env.PORT || 3000,
    collection: collection + '-dev',
    db: 'mongodb://' + mongoURI + '/' + collection + '-dev',
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
    db: 'mongodb://' + mongoURI + '/' + collection + '-test',
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
    db: 'mongodb://' + mongoURI + '/' + collection + '-prod',
    socketIoURL: process.env.SOCKETIOURL || 'http://localhost:3000',
    jwtsecret: process.env.JWTSECRET ||'supersecretsharedkey'
  }
};

module.exports = config[env];
