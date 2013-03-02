/**
 * Module dependencies.
 */
/*global process*/
var express = require('express'),
  http = require('http'),
  path = require('path'),
  util = require('util'),
  auth = require('./lib/auth'),
  url = require('url'),
  Users = require('./lib/dao/Users');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({
    secret: 'grool'
  }));

  auth.configure(app, {
    returnURL: 'http://localhost:' + app.get('port') + '/auth/google/return',
    realm: 'http://localhost:' + app.get('port') + '/'
  }, Users);

  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'web')));
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  console.log(util.inspect(req.user));
  res.render('index', {
    user: req.user,
    title: "nnotz"
  });
});

app.get('/index.html', function(req, res) {
  console.log(util.inspect(req.user));
  res.render('index', {
    user: req.user,
    title: "nnotz"
  });
});

app.get('/nnotz.html', function(req, res) {
  console.log(util.inspect(req.user));
  res.render('nnotz', {
    user: req.user,
    title: "nnotz"
  });
});

app.get('/appcache.mf', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/cache-manifest'
  });
  res.write('CACHE MANIFEST\n');
  res.write('# rev 2\n');
  res.write('CACHE:\n');
  res.write('nnotz.html\n');
  res.end();
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});