var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('./passport');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var ensureLoggedIn = require('connect-ensure-login');

// base de données
var db = require('./database/db');

// routes
var index = require('./routes/index');
var users = require('./routes/users');
var cms = require('./routes/cms');
var cartographie = require('./routes/cartographie');
var themes = ('./routes/themes');
var themeActions = require('./routes/theme');


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret : 'semiologie',
  store: new FileStore({ttl: 10000}),
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/cartographie', cartographie);
app.use('/cms', cms);
app.use('/theme', themeActions);
//app.use('/themes', themes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
  res.render('error');
});

module.exports = app;

console.log(':)');
