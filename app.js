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

//Socket.io

var rooms = {};

var Teacher = mongoose.model('Teacher'),
  Student = mongoose.model('Student'),
  Room = mongoose.model('Room')

var io = require('socket.io')(server);

var sockets = io.sockets.on('connection', function (socket) {
    var handshake = socket.request;
    var roomId = handshake._query['roomId'];
    var token = handshake._query['token'];
    var type = handshake._query['type'];

    var ok = true;
    var currentRoom;

    console.log('Un client est connecté ! ');

    if(type == "teacher"){
      Teacher.findOne({token: token}, function(err, teacher){
        if(err) {
            throw err;
            socket.disconnect();
            ok = false;
            return;
        }else if(teacher == null){
            socket.emit('critical_error', "Token not valid");
            socket.disconnect();
            ok = false;
            return;
        }else{
          return teacher;
        }
      })
      .then(function(teacher){
        if(!ok) return;
        Room.findOne({roomId: roomId},function(err, room){
            if(err) {
                throw err;
                return socket.disconnect();
            }else if(room == null){
                socket.emit('critical_error', "Room Id not valid");
                return socket.disconnect();
            }else if(room.teacher.token != token){
                socket.emit('critical_error', "This is not your room!");
                socket.disconnect();
            }else{
                console.log("Teacher " + teacher.username + " connected!");
                socket.join(roomId);
                setSocketLogic(socket);
                rooms[roomId] = room;
                socket.emit('info', 'Welcome in room ' + roomId + " " + teacher.firstname + " " + teacher.lastname);
                //console.log(rooms);
            }
        });
      });
    }else if(type == "student"){
      Student.findOne({token: token}, function(err, student){
        if(err) {
            throw err;
            socket.disconnect();
            ok = false;
            return;
        }else if(student == null){
            socket.emit('critical_error', "Token not valid");
            socket.disconnect();
            ok = false;
            return;
        }else{
            return student;
        }
      })
      .then(function(student){
        if(!ok) return;
        Room.findOne({roomId: roomId},function(err, room){
            if(err) {
                throw err;
                return socket.disconnect();
            }else if(room == null){
                socket.emit('critical_error', "Room Id not valid");
                return socket.disconnect();
            }else{
                console.log("Student " + student.username + " connected!");
                socket.join(roomId);
                setSocketLogic(socket);
                rooms[roomId].students.push(student._id);
                socket.emit('info', 'Welcome in room ' + roomId + " " + student.username);
                console.log(rooms);
            }
        });
      });
    }else{
      socket.emit('critical_error', "Type not valid!");
      socket.disconnect();
    }
});

function setSocketLogic(socket){
    socket.on('question', function(data){
      console.log(data);
    });

    socket.on('student_answer', function(data){
      console.log(data);
    });
}