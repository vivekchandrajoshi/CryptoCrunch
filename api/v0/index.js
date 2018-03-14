var express = require('express');
var router = express.Router();
//svar a = require('../../views/index.html')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("ABC")
  res.render('../../public/views/index.html');
});

module.exports = router;
