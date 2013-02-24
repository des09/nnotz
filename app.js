/**
 * Module dependencies.
 */
/*global process*/
var express = require('express'),
  http = require('http'),
  path = require('path'),
  util = require('util'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google').Strategy,
  Users = require('./dao/Users');

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
    secret: 'keyboard cat'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'web')));
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.getById(id, done);
});

passport.use(new GoogleStrategy({
  returnURL: 'http://localhost:' + app.get('port') + '/auth/google/return',
  realm: 'http://localhost:' + app.get('port') + '/'
},

function(identifier, profile, done) {
  console.log("IDENTIFIER: " + util.inspect(identifier));
  console.log("PROFILE: " + util.inspect(profile));
  var user = {
    id: identifier,
    displayName: profile.displayName
  };
  Users.addOrUpdate(user, done);
}));

app.configure('development', function() {
  app.use(express.errorHandler());
});

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return',
passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

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
  res.write('# rev 1\n');
  res.write('CACHE:\n');
  res.write('nnotz.html\n');
  res.end();
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});