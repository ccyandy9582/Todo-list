const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const path = require('path')
const logger = require('morgan');
const cookieParser = require('cookie-parser')
const passport = require('passport')
const flash = require('flash')

var app = express()

// get the router
var indexRouter = require('./routes/index')
var signupRouter = require('./routes/signup')
var loginRouter = require('./routes/login')
var logoutRouter = require('./routes/logout')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter)
app.use('/signup', signupRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use("*", indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app