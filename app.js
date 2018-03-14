const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongo = require('./mongoDb/mongo');
const auth = require('./api/v0/auth/auth');
const feed= require('./api/v0/feed/feed');
const index = require('./api/v0/index');
const users = require('./api/v0/users');
var app = express();

// var userController = require('./api/v0.users');

const corsOptions = {
    'origin': '*',
    'methods': ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    'credentials': true,
    'allowedHeaders': ['Content-Type', 'Authorization'],
    'preflightContinue': false,
    'optionsSuccessStatus': 204
}

app.use(cors(corsOptions));
mongo.connect(function (data) {
    // if(data){
    //    convert.getXML('https://www.coindesk.com/feed/', function(data){
    //         console.log(JSON.stringify(data));
    //     });
    // }
});


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public

app.use(methodOverride('X-HTTP-Method-Override'));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/test', index);
app.use('/auth', auth);
app.use('/feed',feed);
app.use('/users',  users);
app.get('*', function(req, res) {
    res.sendFile('./public/views/index.html'); // load our public/index.html file
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  //console.log( config,"env");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});



module.exports = app;
