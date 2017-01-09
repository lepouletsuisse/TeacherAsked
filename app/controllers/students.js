var config = require('../../config/config.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Student = mongoose.model('Student');
var jwt = require('jsonwebtoken');

module.exports = function(app){    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use('/students', router);
};

router.get('/', function(req, res){
    var queryToken = req.query.token;

    Student.findOne({token: queryToken}, function(err, student){
        if(err) {
            return res.status(500).json(err);
        }else if(student == null){
            return res.status(401).json("Token not valid");
        }else{
            return res.status(200).json(student);
        }
    });
});

router.post('/', function(req, res){
    var newStudent = new Student(req.body);

    console.log(newStudent);

    if(newStudent.username === ""){
        return res.status(401).json("Please provide a username");
    }

    var data = {
        "username": newStudent.username,
        "type": "Student"
    };
    newStudent.token = jwt.sign(data, config.jwtsecret);

    newStudent.save(function (err, doc, n){
        if (err){
            console.log(err);
            if(err.name === "ValidationError"){
                return res.status(422).json("Invalid user data");
            } else if(err.name === "MongoError" && err.message.startsWith("E11000 duplicate key")){
                return res.status(422).json("Username is not available");
            } else{
                return res.status(500).json(err);
            }
        }
        console.log("Student created! " + newStudent.username);
        return res.status(201).json(newStudent);
    });
});