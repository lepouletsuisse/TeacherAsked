var config = require('../../config/config.js');
var express = require('express');
var MongoClient = require("mongodb").MongoClient;
var request = require("request-promise");
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var Teacher = mongoose.model('Teacher');

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use('/rooms', router);
};

router.get('/', function(req, res, next){
    var roomId = req.query.roomId;

    Room.findOne({roomId: roomId}, function(err, room){
        if(err){
            if(err.name === "ValidationError"){
                return res.status(422).json("Invalid data");
            } else if(err.name === "CastError" && err.message.startsWith("Cast to number failed")){
                return res.status(422).json("Room Id should be a number!");
            }else{
                return res.status(500).json("Unknow error!");
            }
        }else if(room == null){
            return res.status(401).json("Invalid room id!");
        }else{
            room.questions = undefined;
            return res.status(200).json(room);
        }
    });
});

router.get('/teacher', function(req, res, next){
    var queryToken = req.query.token;
    var ok = true;
    Teacher.findOne({token: queryToken}, function(err, teacher){
        if(err) {
            ok = false;
            return res.status(500).json(err);
        }else if(teacher == null){
            ok = false;
            return res.status(401).json("Token not valid");
        }else{
            return teacher;
        }
    }).then(function(teacher){
        if(!ok) return;
        Room.find({teacher: teacher._id}, function(err, rooms){
            if(err){
                if(err.name === "ValidationError"){
                    return res.status(422).json("Invalid data");
                } else if(err.name === "CastError" && err.message.startsWith("Cast to number failed")){
                    return res.status(422).json("Room Id should be a number!");
                }else{
                    console.log(err);
                    return res.status(500).json("Unknow error!");
                }
            }else if(rooms == null){
                return res.status(401).json("No rooms for this teacher!");
            }else{
                return res.status(200).json(rooms);
            }
        });
    });
});

router.get('/teacher/open', function(req, res, next){
    var queryToken = req.query.token;
    var ok = true;
    Teacher.findOne({token: queryToken}, function(err, teacher){
        if(err) {
            ok = false;
            return res.status(500).json(err);
        }else if(teacher == null){
            ok = false;
            return res.status(401).json("Token not valid");
        }else{
            return teacher;
        }
    }).then(function(teacher){
        if(!ok) return;
        Room.find({teacher: teacher._id, isOpen: true}, function(err, rooms){
            if(err){
                if(err.name === "ValidationError"){
                    return res.status(422).json("Invalid data");
                } else if(err.name === "CastError" && err.message.startsWith("Cast to number failed")){
                    return res.status(422).json("Room Id should be a number!");
                }else{
                    console.log(err);
                    return res.status(500).json("Unknow error!");
                }
            }else if(rooms == null){
                return res.status(401).json("No rooms for this teacher!");
            }else{
                return res.status(200).json(rooms);
            }
        });
    });
});

router.post('/', function(req, res, next){

    var teacherToken = req.body.token;

    Teacher.findOne({token:teacherToken}, function(err, teacher){
        var newRoom = new Room({
            className: req.body.className,
            numberParticipants: req.body.numberParticipants,
            date: new Date,
            students: [],
            teacher: teacher,
            questions: [],
        });

        newRoom.save(function(err, doc, n){
            if(err){
                if(err.errors.numberParticipants.name === "CastError" && err.errors.numberParticipants.message.startsWith("Cast to Number failed")){
                    return res.status(422).json("Number of participants should be a number!");
                }else{
                    return res.status(500).json("Unknow error!");
                }
            }else{
                return res.status(201).json(doc);
            }
        });

    });

});