var config = require('../../config/config.js');
var express = require('express');
var MongoClient = require("mongodb").MongoClient;
var request = require("request-promise");
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var StudentAnswer = mongoose.model('StudentAnswer');

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use('/answers', router);
};

router.get('/', function(req, res){
    res.status(501).json("Not yet!");
});

router.post('/', function(req, res){
    var roomId = req.body.roomId;
    var student = req.body.studentUsername;

    var newAnswer = new StudentAnswer();
    newAnswer.save(function(err, doc, n){
        if(err){
            console.log(err);
            if(err.name === "ValidationError"){
                return next({status: 422, message: "Invalid data"});
            } else{
                return next(err);
            }
        }
        realtime.notifyAnswer(req.body);
        return res.status(201);
    });
})