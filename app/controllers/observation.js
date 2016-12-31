var config = require('../../config/config.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var realtime = require('../realtime/realtime.js');

module.exports = function(app){
    app.use('/observations', router);
};

router.get('/', function(req, res){
    var context = {};
    context.status = 500;
    context.errMessage = "Unknow error occured!";

    res.send("This is some random payload");
});

/*router.post('/', function (req, res, next){
    var newObservation = new Observation(req.body);
    newObservation.save(function(err, doc, n){
        if(err){
            console.log(err);
            if(err.name === "ValidationError"){
                return next({status: 422, message: "Invalid user data"});
            } else{
                return next(err);
            }
        }
        realtime.notifyObservation(req.body);
        return res.status(201).location('/observations/' + newObservation._id).end();
    });
});*/