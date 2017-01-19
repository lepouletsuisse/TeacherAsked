var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  underscore = require('underscore');


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
  Room = mongoose.model('Room');
  Question = mongoose.model('Question'),
  StudentAnswer = mongoose.model('StudentAnswer');

var io = require('socket.io')(server);

var sockets = io.sockets.on('connection', function (socket) {
    var handshake = socket.request;
    var roomId = handshake._query['roomId'];
    var token = handshake._query['token'];
    var studentUsername = handshake._query['username'];
    var type = handshake._query['type'];

    var ok = true;
    var currentRoom;

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
                setSocketLogicTeacher(socket);
                if(rooms[roomId] === undefined) rooms[roomId] = room.toObject();
                rooms[roomId].teacher.socketId = socket.id;
                socket.emit('init_room', rooms[roomId]);
                socket.emit('info', 'Welcome in room ' + roomId + " " + teacher.firstname + " " + teacher.lastname);
            }
        });
      });
    }else if(type == "student"){
      Room.findOne({roomId: roomId},function(err, room){
          if(err) {
              throw err;
              return socket.disconnect();
          }else if(room == null){
              socket.emit('critical_error', "Room Id not valid");
              return socket.disconnect();
          }else{
            console.log("Student " + studentUsername + " connected!");
            if(rooms[roomId] === undefined){
              rooms[roomId] = room.toObject();
            }
            if(rooms[roomId].students === undefined){
              rooms[roomId].students = [];
            }
            if(rooms[roomId].connectedStudents.indexOf(studentUsername) > -1){
              socket.emit("critical_error", "This student is already connected");
              return;
            }
            socket.join(roomId);
            setSocketLogicStudent(socket);
            rooms[roomId].connectedStudents.push(studentUsername);
            if(rooms[roomId].students.indexOf(studentUsername) == -1){
              rooms[roomId].students.push(studentUsername);
              socket.emit('info', 'Welcome in room ' + roomId + " " + studentUsername);
            }else{
              if(rooms[roomId].currentQuestion !== undefined){
                rooms[roomId].currentQuestion.studentAnswers.some(function(answer){
                  if(answer.student == studentUsername){
                    socket.emit('already_answer', answer);
                    return true;
                  }
                });
              }
              socket.emit('info', 'Welcome back in room ' + roomId + " " + studentUsername);
            }
            var roomToStudent = JSON.parse(JSON.stringify(rooms[roomId]));
            if(roomToStudent.currentQuestion !== undefined){
              roomToStudent.currentQuestion.correctTextAnswer = undefined;
              roomToStudent.currentQuestion.correctMultipleAnswer = undefined;
              roomToStudent.currentQuestion.studentAnswers = undefined;
            }
            roomToStudent.teacher.token = undefined;
            roomToStudent.teacher.password = undefined;
            roomToStudent.teacher.socketId = undefined;
            socket.emit('init_room', roomToStudent);
            socket.to(roomId).emit("student_connected", studentUsername);
          }
      });
    }else{
      socket.emit('critical_error', "Type not valid!");
      socket.disconnect();
    }
});

function setSocketLogic(socket){
  socket.on('disconnect', function () {
    var query = socket.request._query;
    if(query["type"] == "student"){
      console.log(query['username'] + ' disconnected!');
      var index = rooms[query['roomId']].connectedStudents.indexOf(query["username"]);
      if (index !== -1) {
          rooms[query['roomId']].connectedStudents.splice(index, 1);
          socket.to(query['roomId']).emit('student_disconnected', rooms[query['roomId']].connectedStudents);
      }else{
        console.log("Something strange with the students list!");
      }
    }
  });
}

function setSocketLogicStudent(socket){
  setSocketLogic(socket);
  socket.on('student_answer', function(answerObject){
    var socketRoom = socket.handshake.query['roomId'];
    var newStudentAnswer = new StudentAnswer({
      answer: answerObject.answer,
      student: answerObject.studentUsername});
    newStudentAnswer.save(function(err, answerSaved, n){
      if(err){
        console.log("Couldn't save the answer! Please try again");
        return socket.emit('basic_error', "Couldn't save the answer! Please try again");
      }
      Question.findOneAndUpdate({_id: rooms[socketRoom].currentQuestion._id}, {$push: {'studentAnswers': answerSaved}}, {new: true}, function(err, questionUpdated){
        if(err){
          console.log("Couldn't update the question with your answer! Please try again");
          return socket.emit("basic_error", "Couldn't update the question with your answer! Please try again");
        }
        rooms[socketRoom].currentQuestion.studentAnswers.push(answerSaved.toObject());
        socket.to(rooms[socketRoom].teacher.socketId).emit('student_answer', answerSaved.toObject());
      });
    })
  });
}

function setSocketLogicTeacher(socket){
  setSocketLogic(socket);
  socket.on('question', function(question){
    var socketRoom = socket.handshake.query['roomId'];
    var ok = true;

    var newQuestion = new Question(question);
    Room.findOne({roomId: socketRoom}, function(err, doc, n){
      if(err) throw err;
      if(doc.currentQuestion !== undefined){
        return socket.emit('basic_error', "A question is already open, please close this one before to submit next!");
      }
      newQuestion.save(function(err, questionSaved, n){
        if(err){
          console.log(err);
          if(err.name === "ValidationError"){
              return socket.emit('basic_error', "Malformed question!");
          } else{
              return socket.emit('basic_error', "Couldn't save the question! Please try again!");
          }
        }else{
          Room.findOneAndUpdate({roomId: socketRoom}, {currentQuestion: questionSaved._id}, {new: true}, function(err, questionSavedAndUpdate){
              if(err){
                  console.log(err);
                  throw err;
              }else{
                Room.findOne({roomId: socketRoom}, function(err, doc, n){
                  rooms[socketRoom].currentQuestion = doc.currentQuestion.toObject();
                  var questionToStudent = underscore.clone(rooms[socketRoom].currentQuestion);
                  questionToStudent.correctTextAnswer = undefined;
                  questionToStudent.correctMultipleAnswer = undefined;
                  socket.emit('question', question);
                  socket.to(socketRoom).emit('question', questionToStudent);
                });
              }
            });
          }
      });
    });
  });
  socket.on("close_question", function(){
    var socketRoom = socket.handshake.query['roomId'];
    Room.findOneAndUpdate(
      {roomId: socketRoom},
      {$push: {'questions': rooms[socketRoom].currentQuestion._id}, $unset: {'currentQuestion': ""}}, 
      {new: true}, 
      function(err, roomUpdated){
        if(err){
          socket.emit("basic_error", "Couldn't close the question, please try again!");
          return;
        }
        Question.findOne({_id: roomUpdated.questions[roomUpdated.questions.length - 1]}, function(err, questionUpdated){
          if(err) throw err;
          rooms[socketRoom].questions.push(questionUpdated.toObject());
          rooms[socketRoom].currentQuestion = undefined;
          var roomToSend = JSON.parse(JSON.stringify(rooms[socketRoom]));
          roomToSend.teacher.token = undefined;
          roomToSend.teacher.password = undefined;
          io.sockets.to(socketRoom).emit("close_question", roomToSend);
        });
    });
  });

  socket.on("close_room", function(){
    var socketRoom = socket.handshake.query['roomId'];
    Room.findOneAndUpdate({roomId: socketRoom}, {isOpen: false}, {new: true}, function(err, updatedRoom){
      if(err){
        console.log(err);
        socket.emit('basic_error', "Couldn't close the room! Please try again");
        return;
      }
      io.sockets.to(socketRoom).emit('close_room');
    });
  });
}