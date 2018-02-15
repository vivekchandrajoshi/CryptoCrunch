var express = require('express');
var router = express.Router();
var passport = require('passport');
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }), function(req, res, next) {
        passport.use(new BearerStrategy(
            function(token, done) {
              User.findOne({ token: token }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { scope: 'read' });
              });
            }
          )); 
       res.send('respond with a resource <a href="/login">login</a>');
    });

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }), function(req, res, next) {
        // console.log(db.getDb(), "mongo data");
        res.send('logout');
    });

router.get('/auth/facebook',
    passport.authenticate('facebook'), function(req, res, next) {
        res.send('respond with a resource <a href="/login">login</a>');
    });

router.get('/auth/facebook/callback',
    passport.authenticate('facebook',
        { successRedirect: '/', failureRedirect: '/login' }),
    function(req, res, next) {
        // console.log(db.getDb(), "mongo data");
        res.send('logout');
    });

module.exports = router;
