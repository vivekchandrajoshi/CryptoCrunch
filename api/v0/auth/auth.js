var express = require('express');
var router = express.Router();
var passport = require('passport');
var util = require('../../../util/util');
var user = require('../schema/user');
var mongo = require ('../../../mongoDb/mongo');

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

    router.post('/auth/register', function(req, res, next) {
        var valid =util.validateModel(user.user,req.body);
        if(valid.length>0){
            res.send(valid);
        }else {
            console.log("test data", util.setData(req.body,'create',null));
            mongo.insertOne('user',util.setData(req.body,'create',null), function(err,data){
                if(!err){
                res.send(data);
                }
                else{
                    res.send(err);
                }
            })
        }
        
       
    });
module.exports = router;
