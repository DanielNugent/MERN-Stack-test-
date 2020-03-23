const passportJWTStrategy = require("passport-jwt").Strategy;
const ExtractJWt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const passport = require('passport');

const options = {};
options.jwtFromRequest = ExtractJWt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretJWTKey;

module.exports = passport => {
  passport.use(
    new passportJWTStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
      .then(user => {
          if(user){
              return done(null, user);
          }
          else return done(null, false);
      })
      .catch();
    })
  );
};
