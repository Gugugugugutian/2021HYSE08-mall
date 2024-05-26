var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
// var sessionStore = require("./util/sessionStore");

var logger = require('morgan');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var addressRouter = require('./routes/address');
var orderRouter = require('./routes/order');
var cors = require('cors');
var corsOptions = {
  origin: 'http://127.0.0.1:5173',
  credentials: true,            //access-control-allow-credentials:true
  // optionSuccessStatus: 200
}
var app = express();

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get("Origin"));
  res.header('Access-Control-Allow-Headers', 'credentials, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, token');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  // 若要返回cookie、携带 session 等信息则将此项设为true。此时Access-Control-Allow-Origin不能设置为*
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '2021homework',
  name: 'sessionId',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 600000 },
}))
app.use(cors(corsOptions));

// Router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);
app.use('/address', addressRouter);
app.use('/orders', orderRouter);

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
