const passport = require('passport');
const GoogleStategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const googleObj = new Object()
googleObj['callbackURL'] = config.get('Auth.google.callbackURL');
googleObj['clientID'] = config.get('Auth.google.clientId');
googleObj['clientSecret'] = config.get('Auth.google.clientSecret');
const facebookObj = new Object()
facebookObj['callbackURL'] = config.get('Auth.facebook.callbackURL');
facebookObj['clientID'] = config.get('Auth.facebook.clientId');
facebookObj['clientSecret'] = config.get('Auth.facebook.clientSecret');

passport.use( new GoogleStategy(googleObj,function (accessToken, refreshToken, profile, done)  {
     console.log("accessToken", accessToken,"refreshToken", refreshToken, "profile", profile, "done",  done);
    }))

passport.use( new FacebookStrategy(facebookObj,
    function(accessToken, refreshToken, profile, done) {
        console.log("accessToken", accessToken,"refreshToken", refreshToken, "profile", profile, "done",  done);

    }
));