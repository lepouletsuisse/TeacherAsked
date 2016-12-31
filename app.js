var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment');


mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

autoIncrement.initialize(db);

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var realtime = require('./app/realtime/realtime.js');
realtime.setup(io);

//app.use(express.static(__dirname + '/index.html'));
app.use(express.static(__dirname + '/'));

app.get('/', function(request, response){
  response.sendFile(__dirname + '/index.html');
})

module.exports = require('./config/express')(app, config);

server.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

process.on('exit', function () {
  console.log('About to exit.');

});