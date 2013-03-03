var passport = require('passport'),
  GoogleStrategy = require('passport-google').Strategy,
  util = require('util'),
  url = require('url'),
  options = {},
  Users = null;


module.exports = {

  configure: function(app, opts, users) {
    options = opts;
    Users = users;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      Users.getById(id, done);
    });

    var strategy = new GoogleStrategy({
      returnURL: options.realm + 'auth/google/return',
      realm: options.realm
    }, this.verify);

    passport.use(strategy);
    
    // Redirect the user to Google for authentication.  When complete, Google
    // will redirect the user back to the application at
    //     /auth/google/return
    app.get('/auth/google', passport.authenticate('google'));

    // Google will redirect the user to this URL after authentication.  Finish
    // the process by verifying the assertion.  If valid, the user will be
    // logged in.  Otherwise, authentication has failed.
    app.get('/auth/google/return', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));
    
  },

  verify: function _verify(identifier, profile, done) {
    console.log("IDENTIFIER: " + util.inspect(identifier));
    console.log("PROFILE: " + util.inspect(profile));
    var user = {
      id: identifier,
      displayName: profile.displayName
    };
    Users.addOrUpdate(user, done);
  }
};