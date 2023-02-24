var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
const lampRouter = require('./routes/lamp')
const usersRouter = require('./routes/users')
const shopRouter = require('./routes/shop')
const config = require('./config/index');
const passport = require('passport')

const errorHandler = require('./middleware/errorHandler')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,
  })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lamp',lampRouter);
app.use('/shop',shopRouter);

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

app.use(errorHandler)

module.exports = app;

