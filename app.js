let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let expressHandlebars = require('./express-handlebars');

let searchApiRoutes = require('./routes/api/search');
let indexRoutes = require('./routes/index');
let searchRoutes = require('./routes/search');

let app = express();

let env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.engine('hbs', expressHandlebars.engine);

app.set('view engine', 'hbs');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/search', searchApiRoutes);
app.use('/', indexRoutes);
app.use('/search', searchRoutes);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, _next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error',
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, _next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error',
  });
});

module.exports = app;
