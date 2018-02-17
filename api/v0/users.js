var express = require('express');
var router = express.Router();
var auth = require('../../auth/auth');
// const db = require('../../mongoDb/mongo')
/* GET users listing. */
router.get('/', auth.isAuth, function(req, res, next) {
  console.log("test")
   // console.log(db.getDb(), "mongo data");
  res.send('respond with a resource <a href="/user/login">login</a>');
});

module.exports = router;
