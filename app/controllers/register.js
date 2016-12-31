var config = require('../../config/config.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Teacher = mongoose.model('Teacher');

module.exports = function(app){    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use('/register', router);
};

router.post('/', function(req, res){
    var context = {};
    var newTeacher = new Teacher(req.body);

    console.log(newTeacher);

    if(newTeacher.username === "" || newTeacher.password === "" || newTeacher.firstname === "" || newTeacher.lastname === ""){
        return res.status(401).json("Please provide all the fields");
    }
    if(newTeacher.password.length < 8){
        return res.status(422).json("Password must be more than 8 characters long");
    }

    newTeacher.save(function (err, doc, n){
            if (err){
                console.log(err);
                if(err.name === "ValidationError"){
                    res.status(422).json("Invalid user data");
                } else if(err.name === "MongoError" && err.message.startsWith("E11000 duplicate key")){
                    res.status(422).json("Username is not available");
                } else{
                    res.status(500).json(err);
                }
            }
            console.log("User created! " + newTeacher.username);
            return res.status(201).json(newTeacher.username);
        });
});