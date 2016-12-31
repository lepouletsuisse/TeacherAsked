var config = require('../../config/config.js');
var express = require('express');
var MongoClient = require("mongodb").MongoClient;
var request = require("request-promise");
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Teacher = mongoose.model('Teacher');
var jwt = require('jsonwebtoken');

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use('/auth', router);
};

router.get('/', function(req, res){
    var newTeacher = new Teacher(req.query);

    if(newTeacher.username === "" || newTeacher.password === ""){
        return res.status(401).json("Please provide all the fields");
    }

    Teacher.findOne({username: newTeacher.username}, function(err, teacher){
        if(err) {
            return res.status(500).json(err);
        }else if(teacher == null || teacher.password != newTeacher.password){
            return res.status(401).json("Invalid credentials! Please try again");
        }else{
            var data = {
                "who": teacher.username,
                "type": "Teacher"
            };
            var newToken = jwt.sign(data, config.jwtsecret);
            Teacher.findOneAndUpdate({username: teacher.username}, {token: newToken}, {new: true}, function(err, teacher){
                if(err){
                    console.log(err);
                    throw err;
                }else{
                    teacher.password = undefined;
                    return res.status(200).json(teacher);
                }
            });
        }
    });
});