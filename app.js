var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var formidable = require('formidable')
var path = require('path')

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

app.use(async (req, res, next) => {

  if (req.method.toLowerCase() === 'post') {

    const form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, "/public/images"),
      keepExtensions: true,
      allowEmptyFiles: true,
    });
    await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        for (const key in fields) {
          fields[key] = fields[key][0];
        }
        if (files.photo) {
          files = files.photo[0];
        }
        req.fields = fields;
        req.files = files;
        resolve();
        next()
      });
    });
    next()
  } else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379
  }),
  secret:'123',
  resave: true,
  saveUninitialized: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/admin', adminRouter);

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
