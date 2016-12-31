var config = require('./config.js');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("Bearer");
opts.secretOrKey = config.jwtsecret;
passport.use(new JwtStrategy(opts, function(jwt_payload, done){
    console.log("Using JSON Web Token passport startegy to authenticate: " + jwt_payload);
    done(null, {name:"lepouletsuisse"});
    }
));

module.exports = passport;