var express = require('express');
var router = express.Router();
const db = require('../../mongoDb/mongo')
/* GET users listing. */
router.get('/', function(req, res, next) {
   // console.log(db.getDb(), "mongo data");
  res.send('respond with a resource <a href="/user/login">login</a>');
});

module.exports = router;
