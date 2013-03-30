var express = require('express'),
  http = require('http'),
  path = require('path'),
  util = require('util'),
  url = require('url'),
  auth = require('./lib/auth'),
  datasource = require('./lib/datasource'),
  UserDao = require('./lib/dao/Users').Users,
  NoteDao = require('./lib/dao/Notes').Notes,
  swagger = require('./lib/swagger'),
  rest_server = require('./lib/rest/server');

var app = express();
var port = process.env.PORT || 3001;
var Users = new UserDao('users');
var Notes = new NoteDao('notes');

// realm is something I made up for configuring passport and swagger
// set it as an environment variable.
app.set('realm', process.env.REALM || 'http://localhost:' + port + '/');

rest_server.setNotes(Notes);

app.configure(function() {
  app.set('port', port);
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
    realm: app.get('realm')
  }, Users);


  app.use(express.methodOverride());
  app.use(app.router);

  app.use(express.static(path.join(__dirname, 'web')));
});

  swagger.configure(app);
  swagger.addGet(rest_server.status);
  swagger.addGet(rest_server.listNotes);
  swagger.addPost(rest_server.addNote);
  swagger.start(app);
  
  
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
  res.write('# rev 6\n');
  res.write('CACHE:\n');
  res.write('nnotz.html\n');
  res.write('css/style.css\n');
  res.end();
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});