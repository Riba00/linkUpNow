const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("../models/Users");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, next) => {
      const user = await Users.findOne({ where: { email, isActive: 1 } });

      if (!user) {
        return next(null, false, {
          message: "User not found",
        });
      }

      const passwordVerify = user.validatePassword(password);

      if (!passwordVerify) return next(null, false, {
        message: 'Incorrect credentials'
      })

      return next(null, user);
    }
  )
);

passport.serializeUser(function(user, cb) {
    cb(null, user)
});

passport.deserializeUser(function(user, cb) {
    cb(null, user)
});

module.exports = passport;
