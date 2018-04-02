var passport = require('passport');
var StrategieLocale = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var User = require('./database/modeles').User;

passport.use(new StrategieLocale({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
  },
  function(email, password, done) {
    User.findOne({ where: { email: email }}).then((user) => {
      bcrypt.compare(password, user.password, function(err, res) {
        if (res) {
          return done(null, user);
        }
        return done(null, false);
      });
    }).catch((err) => { 
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id).then(function (user) {
    cb(null, user);
  });
});

module.exports = passport;