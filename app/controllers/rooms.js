var config = require('../../config/config.js');
var express = require('express');
var MongoClient = require("mongodb").MongoClient;
var request = require("request-promise");
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var Teacher = mongoose.model('Teacher');
var realtime = require('../realtime/realtime.js');

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

    Room.findOne({roomConnectionId: roomId}, function(err, room){
        if(err){
            return next({status: 500, message: err});
        }else if(room == null){
            return next({status: 401, message: "Invalid room id!"})
        }else{
            return res.status(200).json(room);
        }
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
                console.log(err);
                if(err.name === "ValidationError"){
                    return next({status: 422, message: "Invalid data"});
                } else{
                    return next(err);
                }
            }else{
                return res.status(201).json(doc);
            }
        });

    });

});