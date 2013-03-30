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
      console.log("here " + user);
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      Users.findBy('googleId', id, done);
    });

    var strategy = new GoogleStrategy({
      returnURL: options.realm + 'auth/google/return',
      realm: options.realm
    }, this.verifyGoogle);

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

  verifyGoogle: function _verify(identifier, profile, done) {
    Users.findBy("googleId", identifier, function(err, result){
      if(result)
        done(null,result);
      else{
        var user = {
          googleId : identifier,
          displayName: profile.displayName,
          email: profile.emails && profile.emails.length >= 1 ? profile.emails[0] : null,
          created: new Date().getTime()
        };
        Users.insert(user, done);
      }
    });
  }
};