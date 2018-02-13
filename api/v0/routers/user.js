var express = require('express');
var router = express.Router();
var passport = require('passport');
// const db = require('../../mongoDb/mongo')
/* GET users listing. */
router.get('/login',
    passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }), function(req, res, next) {
    // console.log(db.getDb(), "mongo data");
    res.send('respond with a resource <a href="/login">login</a>');
});


router.get('/logout', function(req, res, next) {
    // console.log(db.getDb(), "mongo data");
    res.send('respond with a google <a href="/user/login">login</a>');
});

module.exports = router;
