// Generated by CoffeeScript 1.10.0

/* global redis, redislistener */

(function() {
  var app, config, ecstatic, express, morgan;

  express = require('express');

  app = express();

  morgan = require('morgan');

  config = require('../config.js');

  ecstatic = require('ecstatic');

  app.use(morgan('tiny'));

  console.log('Booting Frontend');

  config.connect('frontend');

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return next();
  });


  /*
  var privateKey = fs.readFileSync('../sslcert/server.key').toString()
  var certificate = fs.readFileSync('../sslcert/server.crt').toString()
  var credentials = {key: privateKey, cert: certificate}
   */

  app.use('/api', require('./routes/schedules'));

  app.use('/api', require('./routes/authentication'));

  app.use('/', ecstatic({
    root: config.webroot
  }));

  app.listen(3000);

  console.log('Reporting to service set');

  redis.zincrby('services', 1, 'frontend');

  process.on('exit', function(code) {
    console.log('Removing From service list');
    redis.zincrby('services', -1, 'frontend');
    redis.quit();
    redislistener.quit();
  });

  process.on('SIGINT', function(code) {
    process.exit();
  });

}).call(this);
