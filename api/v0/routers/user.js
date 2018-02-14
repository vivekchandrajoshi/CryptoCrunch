var express = require('express');
var router = express.Router();
var passport = require('passport');
// const db = require('../../mongoDb/mongo')
/* GET users listing. */
router.get('/login',
    passport.authenticate('google', { scope: ['profile'] }), function(req, res, next) {
    // console.log(db.getDb(), "mongo data");
    res.send('respond with a resource <a href="/login">login</a>');
});

router.get('/logout',
    passport.authenticate('google', { failureRedirect: '/login' }), function(req, res, next) {
        // console.log(db.getDb(), "mongo data");
        res.send('logout');
    });

module.exports = router;
