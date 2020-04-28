var createError = require('http-errors');
var express = require('express');
var path = require('path');
var handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let cookieSession = require('cookie-session');

var app = express();

app.root = (...args) => path.join(__dirname, ...args);

app.inEnvironment = (env) => app.get('env') === env;
app.inProduction = () => app.inEnvironment('production');
app.inTesting = () => app.inEnvironment('testing');
app.inDevelopment = () => app.inEnvironment('development');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = app.get('env');
}

if (process.env.EXPRESS_SESSION_SECRET) {
  app.set('session-secret', process.env.EXPRESS_SESSION_SECRET);
} else {
  app.set('session-secret', 'this-is-a-bad-secret');
}

// view engine setup
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'index',
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let Knex = require('knex');
let dbConfig = require(app.root('knexfile'));
let knex = Knex(dbConfig[process.env.NODE_ENV]);
let { Model } = require('objection');
Model.knex(knex);

let sessionHandler = cookieSession({
  name: 'session',
  secret: app.get('session-secret'),
});

app.use(sessionHandler);

let loadUser = require('./loadUser');
app.use(loadUser);

let indexRouter = require('./routes/index');
let challengesRouter = require('./routes/challenges');
app.use('/', indexRouter);
app.use('/challenges', challengesRouter);

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

module.exports = app;
