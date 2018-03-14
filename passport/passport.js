const passport = require('passport');
const googleStategy = require('passport-google-oauth20');
const facebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const jwt = require('jsonwebtoken');
const mongo = require('../mongoDb/mongo');
const googleObj = new Object()
googleObj['callbackURL'] = config.get('Auth.google.callbackURL');
googleObj['clientID'] = config.get('Auth.google.clientId');
googleObj['clientSecret'] = config.get('Auth.google.clientSecret');
const facebookObj = new Object()
facebookObj['callbackURL'] = config.get('Auth.facebook.callbackURL');
facebookObj['clientID'] = config.get('Auth.facebook.clientId');
facebookObj['clientSecret'] = config.get('Auth.facebook.clientSecret');

passport.use( new googleStategy(googleObj,function (accessToken, refreshToken, profile, done)  {
    //  console.log("accessToken", accessToken,"refreshToken", refreshToken, "profile", profile, "done",  done);
     var userDetails = {
        'displayname' : profile['displayName'],
         'token' : generateToken(profile['displayName'])
     };
    console.log(userDetails,"****data");
     mongo.insertOne('user', userDetails, function(err,data){
         if(!err){
         var userData = {
             'user' : data.ops,
             'token' : generateToken(data.ops)
         }

         }
     });
    }))

passport.use( new facebookStrategy(facebookObj,
    function(accessToken, refreshToken, profile, done) {
        console.log("accessToken", accessToken,"refreshToken", refreshToken, "profile", profile, "done",  done);

    }
));

function generateToken(user) {
	let payload = {
		sub: user,
		exp: Math.floor(Date.now() / 1000) + (60 * 60)    // token with 1 hour of expiration
	};
	return jwt.sign(payload, config.get('Auth.jwt.tokenSecret'));
}