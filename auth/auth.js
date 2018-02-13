const passport = require('passport');
const GoogleStategy = require('passport-google-oauth20');
const config = require('config');
const googleObj = new Object()
googleObj['callbackURL'] = config.get('Auth.google.redirect_uris');
googleObj['clientID'] = config.get('Auth.google.client_id');
googleObj['clientSecret'] = config.get('Auth.google.client_secret');
passport.use(
    new GoogleStategy(googleObj,function (accessToken, refreshToken, profile, done)  {
     console.log("profile");
    })

)

