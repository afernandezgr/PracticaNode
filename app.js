var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//cargamos el connector a la base de datos
require('./lib/connectMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Cargamos nuestras rutas
// Rutas del APIv1
app.use('/apiv1/authenticate', require('./routes/apiv1/authenticate'));
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  if (err.array){ //es un error de express-validator
    err.status = 422; //unprocesable entity...errores de validación
    const errInfo=err.array({ onlyFirstError: true})[0];
    err.message = isAPI(req) ? 
      {message:'Not valid', errors:err.mapped()}:  //para APIs
      `Not valid - ${errInfo.param} ${errInfo.msg}`; //para otras peticiones
  }

  res.status(err.status || 500);

  if (isAPI(req)){  //si es api devuelvo json
   res.json({success: false, error: err.message});
   return; //devolvemos return para que no siga ejecutandose
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

//Para contolar que es una llamada a API
function isAPI(req){
  return req.originalUrl.indexOf('/apiv')===0;
}

module.exports = app;
