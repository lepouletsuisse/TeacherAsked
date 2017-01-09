var config = require('../../config/config.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Teacher = mongoose.model('Teacher');

module.exports = function(app){
    app.use('/teachers', router);
};

router.get('/', function(req, res){
    var queryToken = req.query.token;

    Teacher.findOne({token: queryToken}, function(err, user){
        if(err) {
            return res.status(500).json(err);
        }else if(user == null){
            return res.status(401).json("Token not valid");
        }else{
            user.password = undefined;
            return res.status(200).json(user);
        }
    });
});