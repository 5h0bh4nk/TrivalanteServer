var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/commentRouter');
const favouriteRouter = require('./routes/favouriteRouter');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');
const uploadRouter = require('./routes/uploadRouter');


const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) =>{
  console.log(' cOnnceted to server'+db);
}, (err) => {console.log(err);});

var app = express();

app.all('*', (req,res,next)=>{
  if(req.secure){
    next();
  }
  else{
    res.redirect(307, 'https://'+req.hostname+':'+app.get('secPort')+ req.url);
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12344-67891-12345-54321'));
// app.use(session({
//   name: 'session-id',
//   secret: '12345-54321-12345',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// function auth(req,res,next){
//   console.log(req.session);

//   if(!req.user) {
//       var err = new Error('You are not authenticated!');

//       err.status=401;
//       return next(err);
//   }
//   else{
//       next();
//   }  
// }

// app.use(auth);

//leaving access to public folders
app.use(express.static(path.join(__dirname, 'public')));

app.use('/comments',commentRouter);
app.use('/dishes', dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promos',promoRouter);
app.use('/imgUpload', uploadRouter);
app.use('/favourites', favouriteRouter);

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
